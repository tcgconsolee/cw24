from flask import Flask, render_template, redirect, url_for, request
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from flask_mail import Mail, Message

app = Flask(__name__)
app.config.from_pyfile('config.cfg')

s= URLSafeTimedSerializer('iiao@67165')
mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = "iiao@67165"
db = SQLAlchemy()
 
login_manager = LoginManager(app)

class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(250), unique=True,
                         nullable=False)
    password = db.Column(db.String(250),
                         nullable=False)
    email = db.Column(db.String(250), unique = True,
                      nullable = False)
 
 
db.init_app(app)
 
with app.app_context():
    db.create_all()

@login_manager.user_loader
def loader_user(user_id):
    return Users.query.get(user_id)

@app.route('/register', methods=["GET", "POST"])
def register():

    if request.method == "POST":
        if not db.session.query(Users).filter_by(username=request.form.get("uname")).count() < 1:
            return render_template("sign_up.html", value = "USER ALREADY EXISTS")
        if not db.session.query(Users).filter_by(email=request.form.get("email")).count() < 1:
            return render_template("sign_up.html", value = "EMAIL ALREADY IN USE")
        user = Users(username=request.form.get("uname"),
                     password=request.form.get("psw"),
                     email=request.form.get("email"))
    
        db.session.add(user)    
        db.session.commit()
    
    
        return redirect(url_for("login"))

    return render_template("sign_up.html", value ="")


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))


    if request.method == "POST":
        user = Users.query.filter_by(
            username=request.form.get("uname")).first()
        if not user:
            return render_template("login.html", value = request.form.get("uname"))
    
    
        if user.password == request.form.get("psw"):
            email = user.email
            token = s.dumps(email, salt="email-confirmation")

            msg = Message('Confirm Email', sender="codenet@noreply.com", recipients=[email])

            link = url_for('confirm_email', token=token, user=user, _external = True)

            msg.body = "Your link is {}".format(link)

            mail.send(msg)
    return render_template("login.html")

@app.route('/confirm_email/<token>,<user>')
def confirm_email(token, user):
    try:
        email = s.loads(token, salt="email-confirmation", max_age = 3600)
    except BadTimeSignature:
        return "<h1> WRONG TOKEN </h1>"
    except SignatureExpired:
        return "<h1> TOKEN EXPIRED </h1>"
    login_user(user)
    return redirect(url_for("index"))

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
    

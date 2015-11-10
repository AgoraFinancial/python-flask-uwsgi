from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "<h1 style='color:blue'>Foo Bar!</h1>"

@app.route("/holy-cow")
def holycow():
    return "<h1 style='color:blue'>Holy Cow!!</h1>"

if __name__ == "__main__":
    app.run(host='0.0.0.0')

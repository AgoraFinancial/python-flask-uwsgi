# How to setup Flask, with uwsgi and Nginx

For the most part, we can follow this tutorial from Digital Ocean, [How To Serve Flask Applications with uWSGI and Nginx on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04)

However, certain aspects of this tutorial didn't work for me, so I made some modifications.

#### Prerequisites

You need to have python, pip, python-dev and nginx installed

```bash
sudo apt-get update
sudo apt-get -y install python-pip python-dev nginx
```

Also, you need to install `virtualenv` to isolate Python applications

```bash
sudo pip install virtualenv
```

#### Create our project folder

And add our virtual environment

```bash
mkdir /var/www/python-flask-uwsgi
cd /var/www/python-flask-uwsgi
virtualenv myappenv
```

And activate your virtual environment

```bash
source myappenv/bin/activate
```

#### Install Flask and uWSGI

You need to be in your virtual environment before installing Python dependencies. Your terminal should look something like this;

```bash
(appenv)user@host:/var/www/python-flask-uwsgi$
```

Once you're in your virtual environment, install the dependencies

```bash
pip install uwsgi flask
```
#### Create Your App

**Source Code:** `myapp.py`

Create your primary Flask app file and copy the source code into the file

```bash
vim /var/www/python-flask-uwsgi/myapp.py
```

#### Test Your Flask App

You can now test to make sure your environment and app are setup correctly by running the command

```bash
python myapp.py
```

You should see output like `Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)` and you should be able to navigate to [localhost:5000](http://localhost:5000) and [localhost:5000/holy-cow](http://localhost:5000/holy-cow)

#### Create The uWSGI Server

**Source Code:** `wsgi.py`

Create your primary uWSGI app file and copy the source code into the file

```bash
vim /var/www/python-flask-uwsgi/wsgi.py
```

#### Configure uWSGI

**First** test that uWSGI is actually working.

```bash
uwsgi --socket 0.0.0.0:8000 --protocol=http -w myapp:app
```

You should see output like `uWSGI is running in multiple interpreter mode` and you should be able to navigate to [localhost:8000](http://localhost:8000) and [localhost:8000/holy-cow](http://localhost:8000/holy-cow)

#### Run uWSGI In A Background Process

At this point, Flask and uWSGI should be working. However, we don't want to serve and run uWSGI from the command line. Instead, we can start uWSGI from Ubuntu's `Upstart` init system. Other tutorials suggest `supervisor`, but I'm sticking with `Upstart`

**Source Code:** `uwsgi.ini`

Create your primary uWSGI app file and copy the source code into the file

```bash
vim /var/www/python-flask-uwsgi/uwsgi.ini
```

**Create Upstart Script**


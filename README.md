# How To Setup Flask, With uWSGI And Nginx
**And auto-reload your Python code with Grunt**

For the most part, we can follow this tutorial from Digital Ocean, [How To Serve Flask Applications with uWSGI and Nginx on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-14-04)

However, certain aspects of this tutorial didn't work for me, so I made some modifications.

#### Dependencies

You need to have python, pip, python-dev and nginx installed

```bash
sudo apt-get update
sudo apt-get -y install python-pip python-dev nginx
```

Also, you need to install `virtualenv` to isolate Python applications

```bash
sudo pip install virtualenv
```

#### Create Your Environment

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

Make your log folder and  file

```bash
touch logs/uwsgi.log
sudo chown <user>:<user> logs/uwsgi.log
chmod 774 logs/uwsgi.log

Ensure all of the files in your root directory have the correct owner

```bash
touch logs/uwsgi.log
sudo chown _R <user>:<nginx-user> /var/www/python-flask-uwsgi
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

Be sure to name this file `wsgi.py` and **NOT** `uwsgi.py`, which appears to be a reserved file name.

**Source Code:** `wsgi.py`

Create your primary uWSGI app file and copy the source code into the file

```bash
vim /var/www/python-flask-uwsgi/wsgi.py
```

#### Configure uWSGI

**First** test that uWSGI is actually working.

```bash
uwsgi --socket 0.0.0.0:8000 --protocol=http -w wsgi:app
```

You should see output like `uWSGI is running in multiple interpreter mode` and you should be able to navigate to [localhost:8000](http://localhost:8000) and [localhost:8000/holy-cow](http://localhost:8000/holy-cow)

#### Run uWSGI In A Background Process

At this point, Flask and uWSGI should be working. However, we don't want to serve and run uWSGI from the command line. Instead, we can start uWSGI from Ubuntu's `Upstart` init system. Other tutorials suggest `supervisor`, but I'm sticking with `Upstart`

**Source Code:** `myapp.ini`

Create your primary uWSGI app file and copy the source code into the file

```bash
vim /var/www/python-flask-uwsgi/myapp.ini
```

**Create Upstart Script**

Copy the source code into your `Upstart` script file

**Source Code:** `myapp.ini`

```bash
sudo vim /etc/init/python-flask-uwsgi.conf
```

And then start your `python-flask-uwsgi` service

```bash
sudo service python-flask-uwsgi start

# You can also stop and restart the service
sudo service python-flask-uwsgi stop
sudo service python-flask-uwsgi restart
```

You can troubleshoot issues with your Upstart script by viewing it's log.

```bash
sudo tail -f /var/log/upstart/python-flask-uwsgi.log
```

#### Nginx Configuration

Finally we're getting somewhere!

I will not go into how to install nginx, there are plenty of tutorials you can find on your own.

**Source Code:** `nginx.conf`

```bash
sudo vim /etc/nginx/sites-available/python-flask-uwsgi.dev

# Add your symbolic link to sites-enabled
sudo ln -s /etc/nginx/sites-available/python-flask-uwsgi.dev /etc/nginx/sites-enabled/python-flask-uwsgi.dev

# restart nginx
sudo service nginx restart
```

Edit your hosts file to include `127.0.0.1  python-flask-uwsgi.dev`

```bash
sudo vim /etc/hosts
```

You should now be able to navigate to [python-flask-uwsgi.dev](http://python-flask-uwsgi.dev) and see **Foo Bar!**

#### Auto Reload Python Code On File Change With Grunt
**(Should only be used in development environments)

This is a huge time saver for your development work flow.

**How does this work?**

The `myapp.ini` file has a line `touch-reload = %(base)/reload`. This `uwsgi` directive tells `uwsgi` to recompile your code every time you run the command;

```bash
touch /var/www/python-flask-uwsgi/reload

# You can also reload your python code by restarting your Upstart script
sudo service python-flask-uwsgi restart
```

Instead of manually running terminal commands every time you update your python code (which can be hundreds of times a day during development), you can have `Grunt` monitor your project's `.py` files for changes, and fire the `touch reload` command every time you save changes to a python file.

**Installing Node.js and Grunt**

I will not go into how to install Node.js and Grunt, you can find tutorials on your own.

Copy the relevant `package.json` requirements into your package.json file and update `npm`.

```json
"dependencies": {
    "grunt": "~0.4.1",
    "load-grunt-tasks": "~0.2.0"
},
"devDependencies": {
    "grunt-contrib-watch": "^0.6.1",
    "grunt-shell": "^1.1.2"
}
```

```bash
# install the dependencies
sudo npm update

# start the grunt watch process
grunt monitorpy
```

As you can see in `Gruntfile.js`, `grunt monitorpy` will watch for changes in all .py files, if it detects changes, it will fire the `shell` task, which reloads your python code in `wsgi`.

```javascript
watch: {
    py: {
        files: ['*/*.py', '**/*.py'],
        tasks: ['shell']
    }
},
shell: {
    options: {
        stderr: false
    },
    target: {
        command: 'touch reload'
    }
}
```


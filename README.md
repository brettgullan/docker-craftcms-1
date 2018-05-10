# What is this?

This is a docker-compose project to run up a LEMP stack comprising of:

* [Traefik](https://docs.traefik.io/)
* [Portainer](https://portainer.readthedocs.io/en/stable/)
* Nginx
* MySQL
* PHP
* Redis

The intention is to setup a stack that can be used for local development, but that can also be deployed to a production machine.

We use basic auth on the traefik and portainer services, to allow a semblance of security in a production setting.


# Setup

Copy `.env.example` to `.env`, and amend accordingly.

The value of `DOMAIN` specifies the domain that the services will be exposed as. Given the default of `local.host`, we'll endup with:

* https://traefik.local.host
* https://portainer.local.host
* https://web.local.host

If you're developing locally, you'll want to ensure DNS is set in `/etc/hosts` for the above routes pointing to 127.0.0.1:

```
127.0.0.1	traefik.local.host
127.0.0.1	portainer.local.host
127.0.0.1	web.local.host
```

Alternatively, you could use [Dnsmasq](https://github.com/elalemanyo/docker-localhost#hosts-file---wildcard-dns-domain-on-mac-os-x).


If you want to use a domain other than the default `local.host` domain, you'll want to create a cert -- we suggest using the [wildcard](https://github.com/jcdarwin/wildcard) script, but that's up to you.

Once your cert has been created, you'll want to copy them to `/etc/traefik/`, and amend the following lines in `/etc/traefik/traefik.toml` accordingly:

    certFile = "/etc/traefik/local.host.crt"
    keyFile = "/etc/traefik/local.host.key"

Presuming you're on a Mac, you'll also want to register the cert as trusted so the browser doesn't complain -- this can be done at the command line using a command such as the following:

    sudo security add-trusted-cert -d  -k /Library/Keychains/System.keychain ./etc/traefik/local.host.crt

Note: originally we did try to use `localhost` as our domain, however Chrome doesn't seem to like a domain with only a single step.


# Usage

Use `docker-compose` to start, stop and destroy the stack:

    # starting
    docker-compose up -d --build

    # stopping
    docker-compose stop

    # destroy
    docker-compose down

    # view service bindings
    docker-compose ps

Once the stack is up, you should be able to visit the following in your browser:

* https://traefik.local.host
* https://portainer.local.host
* https://web.local.host

## MySQL

To connect to MySQL via, you'll need to do something like the following:

    # for root access, entering <DB_ROOT_PASSWORD> as the password when challenged
    mysql -u root -p -h 0.0.0.0

    # for non-root access, entering <DB_PASSWORD> as the password when challenged
    mysql -u <DB_USERNAME> -p -h 0.0.0.0


## Installing Craft 2

Set up environment variables

    DOCKER_HOST_DIR=~/workspace/docker-host
    SITE=craft2.local.host

Create our site directory

    mkdir $SITE && cd $SITE

Symlink our site directory to the docker-host nginx share

    ln -s $DOCKER_HOST_DIR/volumes/usr/share/nginx/$SITE $SITE

Download Craft2

    # set environment variables
    CRAFT_VERSION=2.6
    CRAFT_BUILD=3015
    CRAFT_ZIP=Craft-$CRAFT_VERSION.$CRAFT_BUILD.zip

    # also available as https://craftcms.com/latest-v2.zip
    wget https://download.buildwithcraft.com/craft/$CRAFT_VERSION/$CRAFT_VERSION.$CRAFT_BUILD/$CRAFT_ZIP

Unzip Craft2 into our site directory

    unzip -qqo $CRAFT_ZIP 'craft/*' -d $SITE
    unzip -qqo $CRAFT_ZIP 'public/*' -d $SITE

Copy in our overrides

    cp $DOCKER_HOST_DIR/volumes/usr/share/nginx/localhost.example/public/index.php $SITE/public/index.php
    cp $DOCKER_HOST_DIR/volumes/usr/share/nginx/localhost.example/craft/config/*.php $SITE/craft/config/

Add a `.env` with appropriate settings to $SITE

    REDIS_HOST=redis
    DB_HOST=0.0.0.0
    DB_NAME=test
    DB_PORT=3306
    DB_USER=WHOEVER
    DB_PASS=WHATEVER

Add a `composer.json` file  to $SITE and install

    # composer.json
    {
      "require": {
        "vlucas/phpdotenv": "^2.4"
      }
    }

    # install
    composer install -d $SITE

Add our nginx conf

    # link a local conf.d to nginx
    ln -s $DOCKER_HOST_DIR/volumes/etc/nginx/conf.d/ conf.d

Add our nginx log directories

    mkdir $DOCKER_HOST_DIR/volumes/var/log/nginx/$SITE

Add our DNS to `/etc/hosts`

     sudo -- sh -c -e "echo '127.0.0.1\t$SITE' >> /etc/hosts";

navigate to http://<HOSTNAME>/admin to begin installing Craft 2.

https://craft2.local.host/admin


# Further reading

* http://tech.osteel.me/posts/2017/01/15/how-to-use-docker-for-local-web-development-an-update.html
* https://deliciousbrains.com/https-locally-without-browser-privacy-errors/
* https://github.com/wyveo/craftcms-docker/blob/craft2/docker-compose.yml
* [Craft CMS docker-compose dev setup](https://gist.github.com/jackmcpickle/59efc98a99c067b08020)
* https://github.com/pnglabz/docker-compose-lamp
* https://github.com/elalemanyo/docker-localhost

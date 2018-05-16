ansible-role-users
==================

An Ansible role, available via [Ansible Galaxy](https://galaxy.ansible.com), that creates user accounts on Ubuntu and sets them up for SSH access.
The following options are configurable:

* Disallowing SSH password authentication
* Disallowing root SSH access

This role works with [our repo to create a vagrant virtualbox vm](https://github.com/jcdarwin/ansible-roles-vagrant), but is easily modifed to work with actual ubuntu boxes.

You'll probably want to amend / override:

* `defaults/main.yml`

Installation
------------

Preusming a `requirements.yml` as follows:

    # Install a role from GitHub
    - name: ansible-role-users
    src: https://github.com/jcdarwin/ansible-role-users

We can install the role locally, using a `requirements.yml` file:

    # Install a role from GitHub
    - name: ansible-role-users
    src: https://github.com/jcdarwin/ansible-role-users
    path: roles/

Install the role:

    ansible-galaxy install -r requirements.yml -p ./roles

Requirements
------------

You'll need to provide a public key for the `public_key` variable that can be used to access the box as a given user.

Role Variables
--------------

Available variables are listed below, along with default values as found in `defaults/main.yml`:

    # the users to create
    # each user gets a /home directory
    users:
        - deploy
        - git

    # the main group to use when creating the user
    user_group: wheel

    # the groups the user should belong to
    user_groups: ssh,wheel,www-data,sudo

    # users in the following groups get SSH access to the machine
    # note that the value is space-separated
    allow_groups: ssh vagrant

    # the public key value to use to allow the user ssh access
    public_key: '~/.ssh/id_rsa.pub'

    # do we want to disallow root ssh access?
    disallow_root_ssh: true

    # do we want to disallow password ssh access?
    disallow_password_ssh: true

Dependencies
------------

None.

Example Playbook
----------------

Our `hosts` file, as generated by [our repo to create a vagrant virtualbox vm](https://github.com/jcdarwin/ansible-roles-vagrant):

    [vagrant]
    host1 ansible_ssh_host=127.0.0.1 ansible_ssh_port=2222 ansible_user=vagrant ansible_ssh_private_key_file=../.vagrant/machines/default/virtualbox/private_key

We include a playbook at `main.yml`.

Running the playbook:

    # Note that we're presuming our hosts file has been generated by our vagrant repo
    ansible all -m ping -i ../vagrant/ansible/hosts -l all

    ansible-playbook -l all main.yml -i ../vagrant/ansible/hosts

    # Check that we can access the server
    ssh deploy@127.0.0.1 -p 2222
    sudo -s

Note that after running this playbook you'll have improved security by updating the public key for the user `vagrant`, but this means you'll no longer be able to `vagrant ssh`. Instead you'll have to use the following (presuming you've kept the same key in the `defaults/main.yml`):

    ssh vagrant@127.0.0.1 -p 2222 -i ~/.ssh/id_rsa

License
-------

MIT

Author Information
------------------

http://github.com/jcdarwin
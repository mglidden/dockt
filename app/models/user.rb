require 'digest/sha1'
require 'pusher'

Pusher.app_id = '14401'
Pusher.key = 'ab37b6148d60ea118769'
Pusher.secret = 'cbf525b2c7445541cd08'

class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByPassword
  include Authentication::ByCookieToken

  set_table_name 'users'

  validates :login, :presence   => true,
                    :uniqueness => true,
                    :length     => { :within => 3..40 },
                    :format     => { :with => Authentication.login_regex, :message => Authentication.bad_login_message }

  validates :name,  :format     => { :with => Authentication.name_regex, :message => Authentication.bad_name_message },
                    :length     => { :maximum => 100 },
                    :allow_nil  => true

  validates :email, :presence   => true,
  #                  :uniqueness => true,
                    :format     => { :with => Authentication.email_regex, :message => Authentication.bad_email_message },
                    :length     => { :within => 6..100 }

  before_create :make_activation_code 

  # HACK HACK HACK -- how to do attr_accessible from here?
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessible :login, :email, :name, :password, :password_confirmation

  # Activates the user in the database.
  def activate!
    @activated = true
    self.activated_at = Time.now.utc
    self.activation_code = nil
    self.groups = ''
    save(:validate => false)
  end

  # Returns true if the user has just been activated.
  def recently_activated?
    @activated
  end

  def active?
    # the existence of an activation code means they have not activated yet
    activation_code.nil?
  end

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  #
  # uff.  this is really an authorization, not authentication routine.  
  # We really need a Dispatch Chain here or something.
  # This will also let us return a human error message.
  #
  def self.authenticate(login, password)
    return nil if login.blank? || password.blank?
    u = where(['login = ? and activated_at IS NOT NULL', login]).first # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end

  def login=(value)
    write_attribute :login, (value ? value.downcase : nil)
  end

  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end

  def can_access(group)
    return self.can_access_id(group.id)
  end

  def can_access_id(group_id)
    if self.groups == nil
      return false
    end
    return self.groups.split(',').include?(group_id.to_s)
  end

  def add_access(group)
    self.add_access_id(group.id)
  end

  def add_access_id(group_id)
    if self.groups == nil
      self.groups = group_id.to_s
    else
      self.groups = self.groups + ',' + group_id.to_s
    end
    save :validate => false
  end

  def send_message(data)
    Pusher[self.get_channel].trigger(self.get_channel, data)
  end

  def get_channel
    return 'private-updates-'+self.id.to_s
  end

  def viewable_groups
    return Group.all.find_all {|g| self.can_access(g)}
  end

  protected
    
  def make_activation_code
      self.activation_code = self.class.make_token
  end
end

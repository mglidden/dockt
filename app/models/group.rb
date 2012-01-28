class Group < ActiveRecord::Base
    validates :name, :presence => true

    has_many :documents

    def set_editor(user)
      self.editor = user.login
      save :validate => false
    end

    def users_with_access
      return User.all.find_all{|u| u.can_access_id(self.id)}
    end
end

class Group < ActiveRecord::Base
    validates :name, :presence => true

    has_many :documents

    def set_editor(user)
      self.editor = user.login
      save :validate => false
    end
end

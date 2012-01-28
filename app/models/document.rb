class Document < ActiveRecord::Base
  belongs_to :group
  has_many :comments

  def set_editor(user)
    self.editor = user.login
    Group.find(self.group_id).set_editor(user)
    save :validate => false
  end
end

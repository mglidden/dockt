class Document < ActiveRecord::Base
  belongs_to :group
  has_many :comments

  def set_editor(user)
    self.editor = user.login
    Group.find(self.group_id).set_editor(user)
    save :validate => false
  end

  def get_pages
    pages_cmd = IO.popen('ls public/docs/ | grep ^' + self.id.to_s + '-')
    pages = pages_cmd.readlines.collect {|file| ['/docs/' + file[0..-2], file.split('-')[1].to_i]}
    if pages.length == 0
      pages = ['/docs/'+self.id.to_s+'.png']
    end

    pages.sort_by! { |url, filenum| filenum }
    return pages
  end
end

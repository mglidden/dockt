class DocumentsController < ApplicationController
  def create
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = @group.documents.create(params[:document])
    @group.touch
    @doc = @document
    @document.set_editor(current_user)
    @group = Group.find(@document.group_id);
    @users = @group.users_with_access
    file = 'public/docs/' + @document.id.to_s + '_original.pdf'

    Thread.new() {
      response = system('curl ' + @document.url + ' -o ' + file)
      if response
        system('convert ' + file + ' public/docs/' + @document.id.to_s + '.png');

        data = {:namespace => 'alerts', :method => 'fadeAll'}
        current_user.send_message(data)

        @users.each {|u| 
          @display_user = u
          data = {:namespace => 'toolbar', :method => 'addDocRowIfVisible',
                  :parm1 => @document.group_id,
                  :parm2 => render_to_string(:partial => 'documents/document_table_row')}
          u.send_message(data)
        }
      else
        data = {:namespace => 'alerts', :method => 'showWarning',
                :parm1 => 'The document at \'' + @document.url + '\' could not be reached.'}
        current_user.send_message(data)
        @document.destroy
      end
    }
    data = {:namespace => 'alerts', :method => 'showWarning',
            :parm1 => 'Please wait a moment as we download your document.'}
    current_user.send_message(data)

    respond_to do |format|
      format.html { render :inline => '' }
    end
  end

  def new
    @groups = Group.all
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    render :layout => false
  end
  
  def show 
    @groups = Group.find(:all, :order => 'updated_at').reverse()
    @group = Group.find(params[:group_id])
    @pages =[]

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @documents = @group.documents.sort_by {|doc| doc.updated_at}.reverse()
    @document = Document.find(params[:id])
    @comments = @document.comments.sort_by {|comment| comment.updated_at }.reverse()
    @curr_login = current_user.login
    @pages = @document.get_pages
    @pages.sort_by! { |url, filenum|
      filenum
    }

    render :layout => false
  end

  def index
    @groups = Group.find(:all, :order => 'updated_at').reverse().find_all{|g| g.visible or g.visible == nil}
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @documents = @group.documents.sort_by {|doc| doc.updated_at}.reverse().find_all{|d| d.visible or d.visible == nil}
    @groups = @groups.find_all{|g| current_user.can_access(g)}

    if @documents.length == 0
      @doc_alert = 'You have not added any documents. To begin, click on the plus icon to the right, and provide a link to a PDF.'
    end
    
    respond_to do |format|
      format.html
      format.json { render json: @documents }
    end
  end

  def destroy
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = Document.find(params[:document][:id])

    data = {:namespace => 'toolbar', :method => 'removeTableRowHelper',
            :parm1 => '#doc' + @document.id.to_s}
    @group.users_with_access.each do |user|
      if user != current_user
        user.send_message(data)
      end
    end

    @document.visible = false
    @document.save :validate => false

    data = {:namespace => 'alerts', :method => 'showWarning',
            :parm1 => 'You have deleted the document \'' + @document.title + '.\' <a onclick="$.ajax({url:\'/groups/'+@group.id.to_s+'/documents/'+@document.id.to_s+'/undo\'}); alerts.close()">[undo]</a>'}
    current_user.send_message(data)

    respond_to do |format|
      format.html { render :inline => "#doc" + @document.id.to_s }
      format.json {head :ok}
    end
  end

  def undo
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = Document.find(params[:id])
    @document.visible = true
    @document.save :validate => false
    @doc = @document

    @group.users_with_access.each do |u|
      @display_user = u
      data = {:namespace => 'toolbar', :method => 'addDocRowIfVisible',
              :parm1 => @document.group_id,
              :parm2 => render_to_string(:partial => 'documents/document_table_row')}
      u.send_message(data)
    end

    render :inline => ''
  end

  def delete
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @documents = @group.documents.sort_by {|doc| doc.updated_at }.reverse()
    render 'documents/delete', :layout => false
  end

  def pdf
    @group = Group.find(params[:group_id])

    if current_user == nil
      redirect_to :controller => :home, :action => :index
      return
    elsif !current_user.can_access(@group)
      return
    end

    @document = Document.find(params[:document_id])
    render 'documents/pdf', :layout => false
  end
end

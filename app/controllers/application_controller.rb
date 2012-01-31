class ApplicationController < ActionController::Base
  include AuthenticatedSystem

  def search_list
    if current_user == nil
      render :inline => ''
      return
    end

    @groups = current_user.viewable_groups
    search_terms = []

    @groups.each do |group|
      if group.visible or group.visible == nil
        search_terms.push group.name[0..15]
        group.documents.each do |doc|
          if doc.visible or doc.visible == nil
            search_terms.push group.name[0..15] + ' > ' + doc.title[0..15]
            doc.comments.each do |comment|
              search_terms.push group.name[0..15] + ' > ' + doc.title[0..15] + ' > ' + comment.body[0..15]
            end
          end
        end
      end
    end
    
    render json: search_terms
  end

  def query
    puts params
    resp = {}
    query = params[:query]
    terms = query.split(' > ')

    if current_user == nil
      render :inline => ''
    end

    if terms.length == 3
      @results = Comment.all.find_all {|c| (c.body == terms[2]) and (c.document.title == terms[1]) and (c.document.group.name == terms[0]) and (current_user.can_access(c.document.group)) }
    elsif terms.length == 2
      @results = Document.all.find_all {|d| (d.title == terms[1]) and (d.group != nil) and (d.group.name == terms[0]) and (current_user.can_access(d.group))}
    else
      @results = Group.all.find_all {|g| (g.name == terms[0]) and (current_user.can_access(g))}
    end

    if @results.length == 0
      render :inline => ''
    end

    @result = @results[0]
    @group = nil
    @document = nil
    @comment = nil
    @groups = current_user.viewable_groups
    @documents = nil
    @comments = nil
    if terms.length == 3
      @comment = @result
      @document = @result.document
      @group = @document.group
      @documents = @group.documents
      @comments = @document.comments
      @pages = @document.get_pages
      resp[:url] = '/groups/'+@group.id.to_s+'/documents/'+@document.id.to_s+'/comments/'+@comment.id.to_s
    elsif terms.length == 2
      @document = @result
      @group = @document.group
      @documents = @group.documents
      @comments = @document.comments
      @pages = @document.get_pages
      resp[:url] = '/groups/'+@group.id.to_s+'/documents/'+@document.id.to_s+'/comments/'
    else
      @group = @result
      @documents = @group.documents
      resp[:url] = '/groups/'+@group.id.to_s+'/documents/'
    end
    resp[:slider] = render_to_string :partial => 'layouts/slider'
    resp[:center] = [terms.length, 2].min

    render json: resp
  end

  def default_groups
    if current_user
      current_user.add_access_id(2)
      current_user.add_access_id(4)
      current_user.add_access_id(10)
      
      redirect_to :controller => :groups, :action => :index, :layout => 'true'
    else
      redirect_to :controller => :home, :action => :index
    end
  end

  protect_from_forgery
end

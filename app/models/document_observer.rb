class DocumentObserver < ActiveRecord::Observer
  def after_create(document)
    parseFile(document)
  end

  def parseFile(doc)
  end
end

class DocumentObserver < ActiveRecord::Observer
  def after_create(document)
    parseFile(document)
  end

  def parseFile(doc)
    file = 'public/docs/' + doc.id.to_s + '_original.pdf'
    # download file
    Thread.new() {
    system('wget ' + doc.url + ' -O ' + file + '; convert ' + file + ' public/docs/' + doc.id.to_s + '.png')
    }
  end
end

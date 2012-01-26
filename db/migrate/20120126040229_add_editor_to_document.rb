class AddEditorToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :editor, :string
  end
end

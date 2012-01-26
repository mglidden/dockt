class AddEditorToGroup < ActiveRecord::Migration
  def change
    add_column :groups, :editor, :string
  end
end

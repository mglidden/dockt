class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :commenter
      t.text :body
      t.references :document

      t.timestamps
    end
    add_index :comments, :document_id
  end
end

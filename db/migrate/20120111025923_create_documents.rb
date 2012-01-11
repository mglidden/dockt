class CreateDocuments < ActiveRecord::Migration
  def change
    create_table :documents do |t|
      t.string :title
      t.text :url
      t.references :group

      t.timestamps
    end
    add_index :documents, :group_id
  end
end

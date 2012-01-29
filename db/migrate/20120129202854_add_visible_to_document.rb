class AddVisibleToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :visible, :boolean
  end
end

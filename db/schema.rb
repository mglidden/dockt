# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120130033008) do

  create_table "comments", :force => true do |t|
    t.string   "commenter"
    t.text     "body"
    t.integer  "document_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "page"
    t.integer  "offset"
  end

  add_index "comments", ["document_id"], :name => "index_comments_on_document_id"

  create_table "documents", :force => true do |t|
    t.string   "title"
    t.text     "url"
    t.integer  "group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "editor"
    t.boolean  "visible"
  end

  add_index "documents", ["group_id"], :name => "index_documents_on_group_id"

  create_table "groups", :force => true do |t|
    t.string   "name"
    t.string   "modified"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "editor"
    t.boolean  "visible"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                     :limit => 40
    t.string   "name",                      :limit => 100, :default => ""
    t.string   "email",                     :limit => 100
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token",            :limit => 40
    t.datetime "remember_token_expires_at"
    t.string   "activation_code",           :limit => 40
    t.datetime "activated_at"
    t.text     "groups"
  end

  add_index "users", ["login"], :name => "index_users_on_login", :unique => true

end

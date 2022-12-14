# frozen_string_literal: true

class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.text :title
      t.timestamps
    end
  end

  def down
    drop_table :tasks
  end
end

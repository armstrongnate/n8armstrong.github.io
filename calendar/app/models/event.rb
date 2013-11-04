class Event < ActiveRecord::Base

  validates :title, :starts_at, presence: true

end

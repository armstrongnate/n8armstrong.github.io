object @event
attributes :id, :starts_at, :ends_at, :title, :notes, :location, :color

node :starts_at do |e|
  e.starts_at.to_s.first(19)
end

node :ends_at do |e|
  e.ends_at.to_s.first(19)
end

node :is_multi_day do |e|
  !(e.starts_at.day == e.ends_at.try(:day))
end

node :all_day do |e|
  !(e.starts_at.day == e.ends_at.try(:day)) ? 'NO' : 'YES'
end

node :starts_at_time do |e|
  e.starts_at.strftime('%I:%M %P')
end

node :ends_at_time do |e|
  e.starts_at.strftime('%I:%M %P') if e.ends_at.present?
end

node :starts_at_date do |e|
  e.starts_at.strftime('%m/%d/%Y')
end

node :ends_at_date do |e|
  e.ends_at.strftime('%m/%d/%Y') if e.ends_at.present?
end

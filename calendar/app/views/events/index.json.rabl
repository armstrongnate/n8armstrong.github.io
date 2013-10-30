collection @events
attributes :id, :starts_at, :ends_at, :title, :notes, :location, :color

node :starts_at do |e|
  e.starts_at.to_s.first(19)
end

node :ends_at do |e|
  e.ends_at.to_s.first(19)
end

class EventsController < ApplicationController
  respond_to :html, :json

  def index
    @events = Event.all
  end
end

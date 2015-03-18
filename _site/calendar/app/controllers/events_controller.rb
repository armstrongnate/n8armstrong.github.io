class EventsController < ApplicationController
  respond_to :html, :json

  def index
    @events = Event.all
  end

  def update
    @event = Event.find(params[:id])
    if @event.update_attributes(safe_params)
      render text: 'success', status: :ok
    else
      render text: 'failure', status: :not_acceptable
    end
  end

  def create
    @event = Event.new(safe_params)
    if @event.save
      render :show
    else
      render text: 'failure', status: :not_acceptable
    end
  end

  def destroy
    @event = Event.find(params[:id])
    if @event.destroy
      render text: 'success', status: :ok
    else
      render text: 'failur', status: :not_acceptable
    end
  end

  private

  def safe_params
    safe_attributes = [
      :id,
      :starts_at,
      :ends_at,
      :title,
      :notes,
      :location,
      :color,
    ]
    params.require(:event).permit(*safe_attributes)
  end
end

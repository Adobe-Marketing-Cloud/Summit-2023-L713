/*
Copyright 2023 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useMemo } from 'react';
import {Link} from 'react-router-dom';
import useGraphQL from '../api/useGraphQL';
import Error from './Error';
import Loading from './Loading';
import "./Events.scss";

function EventItem(props) {
  // Must have eventName, path, and image
  if (!props || !props._path || !props.eventName || !props.teasingImage) {
    return null;
  }

  return (
    <li className="event-item" itemScope>
      <Link to={`/event:${props.slug}`}>
        <img className="event-item-image" src={`${props.teasingImage._publishUrl}`}
                alt={props.title} itemProp="teasingImage" itemType="image" />
        <div className="event-item-title" itemProp="eventName" itemType="text">{props.eventName}</div>
      </Link>
      <div className="event-item-details">
        <span className="event-item-date" itemProp="eventStart" itemType="date">{props.eventStart}</span>
        <span> to </span>
        <span className="event-item-date" itemProp="eventEnd" itemType="date">{props.eventEnd}</span>
      </div>
    </li>
  );
}

// this has to be declared outside the render function so it is constant
// otherwise there is an infinite re-render loop
const queryParameters = {
  count: 2
};

function Events() {
  const persistentQuery = 'wknd-shared/events-paginated';
  // Use a custom React Hook to execute the GraphQL query
  
  const { data, errorMessage } = useGraphQL(undefined, persistentQuery, queryParameters);

  // If there is an error with the GraphQL query
  if (errorMessage) return <Error errorMessage={errorMessage} />;

  // If data is null then return a loading state...
  if (!data) return <Loading />;

  return (
      <div className="events">
        <h2>WKND Events</h2>
        <ul className="event-items">
          {
              // Iterate over the returned data items from the query
              data.eventPaginated.edges.map((event, index) => {
                return (
                  <EventItem key={event.node.slug} {...event.node} />
                );
              })
          }
          </ul>
      </div>
  );
}

export default Events;

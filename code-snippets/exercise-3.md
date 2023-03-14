# Code Snippets for Exercise 3

## 3.2 Create Event Detail

```
/*
Copyright 2023 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useMemo } from 'react';
import { Link, useNavigate, useParams} from "react-router-dom";
import backIcon from '../images/icon-close.svg';
import Error from './Error';
import Loading from './Loading';
import { mapJsonRichText } from '../utils/renderRichText';
import './EventDetail.scss';
import useGraphQL from '../api/useGraphQL';

function EventDetail() {

    // params hook from React router
    const { slug } = useParams();
    const navigate = useNavigate();
    const eventSlug = slug.substring(1);

    // define the name of the persistentQuery for this component
    const persistentQuery = '';

    // Use a custom React Hook to execute the GraphQL query
    const params = useMemo(() => {
        return {slug: eventSlug };
    }, [eventSlug]);
    const { data, errorMessage } = useGraphQL('', persistentQuery, params);

    // If there is an error with the GraphQL query
    if(errorMessage) return <Error errorMessage={errorMessage} />;

    // If query response is null then return a loading icon...
    if(!data) return <Loading />;

    // add event rendering logic here
}

export default EventDetail;
```

```
function EventDetail() {
    // replace this on line 26
    const persistentQuery = 'wknd-shared/event-by-slug';
}
```

```
function EventDetail() {
    // add event rendering logic here
    // Set event properties variable based on graphQL response
    const currentEvent = getEvent(data);

    // Set references of current event
    const references = data.eventList._references;

    // Must have title, path, and image
    if( !currentEvent) {
      return <NoEventFound />;
    }
}
```

```
// these should go after the import statement but before the EventDetail() function
function NoEventFound() {
    return (
        <div className="event-detail">
            <Link className="event-detail-close-button" to={"/"}>
                <img className="Backbutton-icon" src={backIcon} alt="Return" />
            </Link>
            <Error errorMessage="Missing data, event could not be rendered." />
        </div>
    );
}

/**
 * Helper function to get the first event from the response
 * @param {*} response
 */
function getEvent(data) {

    if (data && data.eventList && data.eventList.items) {
        // expect there only to be a single event in the array
        if(data.eventList.items.length === 1) {
            return data.eventList.items[0];
        }
    }
    return undefined;
}
```

```
   // this goes at the end of the EventDetal() function
    return (<div className="event-detail">
      <button className="event-detail-close-button" onClick={() => navigate(-1)} >
          <img className="Backbutton-icon" src={backIcon} alt="Return" />
      </button>
      <EventDetailRender {...currentEvent} references={references}/>
    </div>);
```

```
// these should go before the EventDetail() function but after the GetEvent() function we added before.
function EventDetailRender(props) {
    return (
        <div>
            <h1 className="event-detail-title">{props.eventName}</h1>
            <div className="event-detail-content">
                <img className="event-detail-teasingImage"
                    src={props.teasingImage._publishUrl} alt={props.eventName} />
                <div>
                <div className="event-detail-dates">
                    <span className="event-item-date">{props.startDate}</span>
                    <span> to </span>
                    <span className="event-item-date">{props.endDate}</span>
                </div>
                <div className="event-detail-description">{mapJsonRichText(props.description.json, customRenderOptions(props.references))}</div>
                </div>
                <div className="event-detail-speakers">
                    <h2>Featured Speakers</h2>
                    <ul className="event-detail-speakers-grid">
                        {
                            props.speakers.map((speaker) => {
                                return <EventDetailSpeaker key={speaker._path} {...speaker} />
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

/**
 * Example of using a custom render for in-line references in a multi line field
 */
function customRenderOptions(references) {

    const renderReference = {
        // node contains merged properties of the in-line reference and _references object
        'ImageRef': (node) => {
            // when __typename === ImageRef
           return <img src={node._path} alt={'in-line reference'} />
        },
        'EventModel': (node) => {
            // when __typename === EventModel
            return <Link to={'/event:${node.slug}'}>{`${node.eventName}: ${node.capacity}`}</Link>;
        }
    };

    return {
        nodeMap: {
            'reference': (node, children) => {

                // variable for reference in _references object
                let reference;

                // asset reference
                if(node.data.path) {
                    // find reference based on path
                    reference = references.find( ref => ref._path === node.data.path);
                }
                // Fragment Reference
                if(node.data.href) {
                    // find in-line reference within _references array based on href and _path properties
                    reference = references.find( ref => ref._path === node.data.href);
                }

                // if reference found return render method of it
                return reference ? renderReference[reference.__typename]({...reference, ...node}) : null;
            }
        },
    };
}

function EventDetailSpeaker(props) {
    const IsKeynoteSpeaker = (props.__typename === 'KeynoteSpeakerModel');
    const keynnoteSpeakerClass = IsKeynoteSpeaker ? ' event-detail-keynote-speaker' : '';
    const picture = IsKeynoteSpeaker ? props.heroImage : props.profilePicture;

    return (
        <li className={"event-detail-speaker" + keynnoteSpeakerClass}>
            <div className="event-detail-speaker-card">
                <span className="event-detail-speaker-name">{props.name}</span>
                <span className="event-detail-speaker-title">{props.title}</span>
            </div>
            <img className="event-detail-speaker-img"
                    src={picture._publishUrl} alt={props.name}/>
        </li>
    );
}
```

### EventDetail.scss

```
/*
Copyright 2022 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
@use "sass:math";

@import '../styles/variables';

.event-detail {
  .event-detail-close-button {
    width: 24px;
    float: right;
    margin: 1em;
    background: none;
    border: none;
  }

  .event-detail-content {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    width: 100%;

    .event-detail-teasingImage {
      width: 100%;
      height: auto;
    }

    .event-detail-speakers {
      grid-column: 1 / -1;

       .event-detail-speakers-grid {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin: 2rem;

        .event-detail-speaker {
          position: relative;
          // width: 250px;
          height: 350px;
          display: grid;
          grid-template-rows: 1fr auto;

          &.event-detail-keynote-speaker {
            background-image: url("../images/keynote-bg.png");
          }

          .event-detail-speaker-card {
            background-color: rgba(#000, .7);
            color: white;
            grid-row: 2;
            padding: .5rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            z-index: 1;

            > span {
              margin-bottom: .4rem;
            }

            .event-detail-speaker-name {
              font-weight: 700;
            }
          }

          .event-detail-speaker-img {
            position: absolute;
            object-fit: cover;
            inset: 0;
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: $mobile-breakpoint) {
  .event-detail {
    .event-detail-content {
      grid-template-columns: 1fr 1fr;

      .event-detail-speakers {
        .event-detail-speakers-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }
}

@media only screen and (min-width: $tablet-breakpoint) {
  .event-detail {
    .event-detail-content {
      .event-detail-speakers {
        .event-detail-speakers-grid {
          grid-template-columns: repeat(4, 1fr);

          .event-detail-speaker.event-detail-keynote-speaker {
            grid-column: span 2;
          }
        }
      }
    }
  }
}
```

### App.js

```
<Route path="/event:slug" element={<EventDetail />} />
```

```
import EventDetail from "./components/EventDetail";
```

## 3.3 Universal Editor

```
<meta name="theme-color" content="#000000" />
<meta name="urn:auecon:aemconnection" content="aem:https://author-p12345-e67890.adobeaemcloud.com">
```

### Instrumenting the application

```
function EventItem(props) {
  const editorProps = useMemo(() => true && { itemID: "urn:aemconnection:" + props?._path + "/jcr:content/data/master"}, [props._path]);

  // Rest of the function
  // ...
}
```

```
  return (
    <li className="event-item" itemScope {...editorProps}>
      <Link to={`/event:${props.slug}`}>
        <img className="event-item-image" src={`${props.teasingImage._publishUrl}`}
                alt={props.title} itemProp="teasingImage" />
        <div className="event-item-title" itemProp="eventName" itemType="text">{props.eventName}</div>
      </Link>
      <div className="event-item-details">
        <span className="event-item-date">{props.startDate}</span>
        <span> to </span>
        <span className="event-item-date">{props.endDate}</span>
      </div>
    </li>
  );
```

### Connecting to Content Fragment Editor

```
function EventItem(props) {
  const editorProps = useMemo(() => true && { itemID: "urn:aemconnection:" + props?._path + "/jcr:content/data/master", itemType: "reference", itemfilter: "cf"}, [props._path]);

  // ...
}
```

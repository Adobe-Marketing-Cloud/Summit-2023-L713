# Code Snippets for Exercise 2

## 2.2.2 Build first query

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
  ) {
    item {
      _path
      eventName
      slug
      startDate
      endDate
    }
  }
}
```

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
  ) {
    item {
      # Add to previous
      description {
        html
      }
    }
  }
}
```

## 2.3.1 Querying fragment references

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
  ) {
    item {
      # Add to previous
      speakers {
        name
        title
      }
    }
  }
}
```

## 2.3.2 Using GraphQL Union

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
  ) {
    item {
      # Replaces previous "speakers" section
      speakers {
        # For speakers we still return the same fields
        ...on EventSpeakerModel {
          name
          title
        }
        # For keynote speakers we return slightly different information
        ...on KeynoteSpeakerModel {
          name
          biography {
            html
          }
        }
      }
    }
  }
}
```

## 2.3.3 Query content references

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
  ) {
    item {
      # Add to previous
      teasingImage {
        ... on ImageRef {
          _path
          _publishUrl
          mimeType
          width
          height
        }
      }
    }
  }
}
```

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
  ) {
    # Add to previous
    _references {
      ... on ImageRef {
        _path
        _publishUrl
        mimeType
        width
        height
      }
      ... on MultimediaRef {
        _publishUrl
        format
      }
      ... on DocumentRef {
        _publishUrl
        type
        author
      }
    }
    item {
      # Adjust the information requested from speakers
      speakers {
        name
        title
        # Add profile picture information (only the path)
        profilePicture {
          ... on ImageRef {
            _path
          }
        }
      }
      # Replace previous "teaserImage" block (only the path)
      teasingImage {
        ... on ImageRef {
          _path
        }
      }
    }
  }
}
```

## Dynamic Images

```
{
  eventByPath(
    _path: "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
    # Add asset transformation instructions
    _assetTransform: {
      format: WEBP
      size: {
        height: 200
        width: 500
      }
      quality: 75
    }
  ) {
    # Remove "_references" information
    item {
      # Replace teasing image with a dynamic URL
      teasingImage {
        ... on ImageRef {
          _path
          _dynamicUrl
          mimeType
        }
      }
    }
  }
}
```

## 2.3.4 Using Parameters

```
# Name the query and specify parameter(s)
query eventByPath($event: String!) {
  eventByPath(
    # Replace hardcoded path with the variable
    _path: $event
  ) {
    item {
      _path
      eventName
      slug
    }
  }
}
```

```
{
  "event": "/content/dam/wknd-shared/en/events/summit-2023/summit-2023"
}
```

```
{
  "event": "/content/dam/wknd-shared/en/events/max-2022/max-2022"
}
```

## 2.3.4 Retrieve a list of fragments

```
{
  # Retrieves a list of content speakers
  breakoutSpeakerList {
    items {
      _path
      name
      title
      company
    }
  }
}
```

## Limit

```
{
  breakoutSpeakerList (
    # Limit results to first 10 entries
    limit: 10
  ) {
    items {
      _path
      name
      title
      company
    }
  }
}
```

## Offset

```
{
  breakoutSpeakerList (
    # Limit results to first 10 entries
    limit: 10
    # Provide offset to indicate how many entries should be skipped
    offset: 10
  ) {
    items {
      _path
      name
      title
      company
    }
  }
}
```

## 2.3.6 Retrieve a paginated set of fragments

```
{
  # Use of ...Paginated instead of ...List
  breakoutSpeakerPaginated {
    # Results are contained in "edges" object
    edges {
      # Each result is a "node"
      node {
        # From there on, same properties, this node represents a breakout speaker
        _path
        name
        title
        company
      }
    }
  }
}
```

## Paginated Limit

```
{
  breakoutSpeakerPaginated (
    # Get first 10 entries
    first: 10
  ) {
    edges {
      node {
        _path
        name
        title
        company
      }
    }
  }
}
```

## Navigting Pages

```
{
  breakoutSpeakerPaginated (
    first: 10
  ) {
    edges {
      node {
        _path
        name
        title
        company
      }
    }
    # Request page information
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## After Cursor

```
{
  breakoutSpeakerPaginated (
    first: 10
    # Request page information
    after: "MzNhMjMwMzMtNmFjMC00NWY1LTlmMDUtYzMzZjAzMzcwMDEy"
  ) {
    edges {
      node {
        _path
        name
        title
        company
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## 2.3.7 Sort results

```
{
  breakoutSpeakerPaginated (
    first: 10
    sort: "name"
  ) {
    edges {
      node {
        _path
        name
        title
        company
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## 2.3.8 Filter results

```
{
  breakoutSpeakerPaginated (
    filter: {
      # Filter on the "name" property
      name: {
        _expressions: [
          # List of expressions
          {
            # Value to filter on
            value: "Ben Snyder"
            # Operator to use
            _operator: EQUALS
          }
        ]
      }
    }
  ) {
    edges {
      node {
        _path
        name
        title
        company
      }
    }
  }
}
```

```
{
  breakoutSpeakerPaginated (
    filter: {
      name: {
        _expressions: [
          {
            # Change search criteria
            value: "ben"
            # Change operator to contains
            _operator: CONTAINS
            # Case is not important
            _ignoreCase: true
          }
        ]
      }
    }
  ) {
    edges {
      ...
    }
  }
}
```

## Comined Filters

```
{
  breakoutSpeakerPaginated (
    filter: {
      name: {
        # Define how to combine filters
        _logOp: OR
        _expressions: [
          {
            value: "ben"
            _operator: CONTAINS
            _ignoreCase: true
          },
          # Second criteria
          {
            value: "Adam Pazik"
            _operator: EQUALS
          }
        ]
      }
    }
  ) {
    edges {
      ...
    }
  }
}
```

```
{
  breakoutSpeakerPaginated (
    filter: {
      # Combine filter on multiple properties
      _logOp: AND
      company: {
        # Filter on "company"
        _expressions: {
          value: "Adobe"
          _operator: EQUALS
        }
      }
      title: {
        # Filter on "title"
        _expressions: [
          {
            value: "Director"
            _operator: CONTAINS
          }
        ]
      }
    }
  ) {
    edges {
      ...
    }
  }
}
```

## Querying Variations

```
{
  breakoutSpeakerPaginated (
    filter: {
      _logOp: AND
      company: {
        _expressions: {
          value: "Adobe"
          _operator: EQUALS
        }
      }
      title: {
        _expressions: [
          {
            value: "Director"
            _operator: CONTAINS
          }
        ]
      }
    }
    # Filter to return a specific variation
    variation: "new"
  ) {
    edges {
      ...
    }
  }
}
```

## Querying Localized Content

```
{
  # Return articles based on a filter on difficulty
  adventureList (
    filter: {
      difficulty: {
        _expressions: {
          value: "Intermediate"
          _operator: EQUALS
        }
      }
    }
  ) {
    items {
      _path
      title
      description {
        plaintext
      }
    }
  }
}
```

```
{
  adventureList (
    filter: {
      difficulty: {
        _expressions: {
          value: "Intermediate"
          _operator: EQUALS
        }
      }
    }
    # Restrict results to "French"
    _locale: "fr"
  ) {
    items {
      ...
    }
  }
}
```

## Filtering on nested properties

```
{
  articleList {
    items {
      _path
      title
      slug
      # Author is a nested content fragment
      authorFragment {
        firstName
        lastName
        profilePicture {
          ...on ImageRef {
            _path
            _authorUrl
            _publishUrl
          }
        }
      }
    }
  }
}
```

```
{
  articleList(
    filter: {
      # Filter on nested content fragment
      authorFragment: {
        # Specify on which property to filter
        lastName: {
          _expressions: {
            value: "Sjöberg",
            _operator: EQUALS
          }
        }
      }
    }
  ) {
    items {
      ...
    }
  }
}
```

## 2.4 Building persisted queries

```
query GetEvents($count: Int!, $after: String) {
  eventPaginated(
    first: $count,
    after: $after,
    sort: "startDate desc"
  ) {
    edges {
      node {
        _path
        slug
        eventName
        startDate
        endDate
        teasingImage {
          ... on ImageRef {
            _path
            _authorUrl
            _publishUrl
            mimeType
            width
            height
          }
        }
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
```

```
{
  "count": 10
}
```

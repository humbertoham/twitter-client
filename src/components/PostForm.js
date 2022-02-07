import React from "react";

import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useForm } from "../utils/hooks";

import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../utils/graphql";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post: </h2>
        <Form.Field>
          <Form.Input
            placeholder="What are you thinking?"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal" style={{ marginBottom: 10 }}>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          {" "}
          <li className="list"> {error.graphQLErrors[0].message}</li>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default PostForm;

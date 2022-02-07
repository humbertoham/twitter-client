import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../utils/graphql";
function DeleteButton({ postId, callback, commentId }) {
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ FETCH_POSTS_QUERY, data });
      }

      if (callback) callback();
    },

    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <Popup
        content={commentId ? "Delete comment" : "Delete post"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ marginBottom: 0 }} />
          </Button>
        }
      />
      <Confirm
        className="form-container"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;

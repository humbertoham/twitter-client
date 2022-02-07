import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { useParams, useNavigate } from "react-router-dom";

import {
  Form,
  Button,
  Label,
  Icon,
  Card,
  Grid,
  Image,
} from "semantic-ui-react";

function SinglePost(props) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const { data: { getPost } = {} } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    navigate("/");
  }
  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCout,
    } = getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              size="small"
              floated="right"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                {username}
                <Card.Meta>
                  {moment(createdAt).fromNow()}
                  <Card.Description>{body}</Card.Description>
                </Card.Meta>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("comments")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>

                  <Label basic color="blue" pointing="left">
                    {commentCout}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton
                    postId={id}
                    callback={deletePostCallback}
                    className="auto"
                  />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_POSTS_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }

      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
const CREATE_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;

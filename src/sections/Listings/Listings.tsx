import React, { FC } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";

import { Avatar, Alert, Button, List, Spin } from "antd";

import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { GenerateListings as GenerateListingsData } from "./__generated__/GenerateListings";

import { ListingsSkeleton } from "./components";

import "./styles/Listings.css";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

const GENERATE_LISTINGS = gql`
  mutation GenerateListings {
    generateListings
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { error: deleteListingError, loading: deleteListingLoading },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING, {
    onError(error) {
      console.error(error);
    },
  });

  const [generateListings, { error: generateListingsError }] = useMutation<
    GenerateListingsData
  >(GENERATE_LISTINGS, {
    onError(error) {
      console.error(error);
    },
  });

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };
  const handleGenerateListings = async () => {
    await generateListings();
    refetch();
  };

  const listings = data ? data.listings : [];
  const listingsList = (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  );

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  const generateListingsErrorAlert = generateListingsError ? (
    <Alert
      type="error"
      message="Whoops! Generate listing failed. Please try again."
      className="listings__alert"
    />
  ) : null;

  if (!listings.length) {
    return (
      <div className="listings">
        <Button
          type="primary"
          onClick={() => handleGenerateListings()}
          style={{ marginBottom: "20px" }}
        >
          Generate Listing!
        </Button>
        {generateListingsErrorAlert}
      </div>
    );
  }

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="Whoops! Delete listing failed. Please try again."
      className="listings__alert"
    />
  ) : null;

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingsList}
      </Spin>
    </div>
  );
};

// FC
export const Listings2: FC<Props> = ({ title }) => {
  return <h2>{title}</h2>;
};

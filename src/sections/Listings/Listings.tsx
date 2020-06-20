import React, { FC } from "react";

import { useQuery, useMutation } from "../../lib/api";
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

const LISTINGS = `
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

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
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
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ id });
    refetch();
  };

  const listings = data ? data.listings : [];
  const listingsList = (
    <ul>
      {listings.map((listing) => (
        <li key={listing.id}>
          {listing.title}
          <button onClick={() => handleDeleteListing(listing.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Whoops! Something went wrong. Please try again.</h2>;
  }

  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null;
  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Whoops! Something when wrong with delete. Please try again.</h4>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};

// FC
export const Listings2: FC<Props> = ({ title }) => {
  return <h2>{title}</h2>;
};

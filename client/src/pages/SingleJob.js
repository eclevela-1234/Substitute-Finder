import React from 'react';
import { useParams } from 'react-router-dom';

import ApplicantList from '../components/ApplicantList';

import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_JOB, QUERY_ME } from '../utils/queries';
import { useMutation } from '@apollo/client';
import { ADD_APPLICATION } from '../utils/mutations';


const SingleJob = () => {
  const { id: jobId } = useParams();
  const [addApplication] = useMutation(ADD_APPLICATION);
  const { data: userData } = useQuery(QUERY_ME);

  const admin = userData?.me.admin || "";
  
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: jobId },
  });

  const job = data?.job || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addApplication({
        variables: {jobId },
      });

    } catch (e) {
      console.error(e);
    }
  };

  const applied = job.applications.find(app => app._id === userData.me._id);


  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {job.username}
          </span>{' '}
          job on {job.createdAt}
        </p>
        <div className="card-body">
          <p>{job.description}</p>
        </div>
      </div>

      {job.applicationCount > 0 && admin && (
        <div>
          <ApplicantList applications={job.applications} />
        </div>
      )}

      {Auth.loggedIn() && !admin && !applied &&
        <form onSubmit={handleFormSubmit}>
          <button className="btn col-12 col-md-3" type="submit">Apply</button> 
        </form>
      }
      {Auth.loggedIn() && !admin && applied &&
        <p>
          Already Applied!
        </p>
      }
    </div>
  );
};

export default SingleJob;
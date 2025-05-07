import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormModal from "../components/formModal";
import CandidateForm from "./candidateForm";
import Loader from "./loader";

const candidate = ()=>{

    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    let sNo = 1;
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = useState("");
    const [filterPosition, setFilterPosition] = useState("");

    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState(null);

    const fetchCandidates = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getCandidates`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.log(response);
                setLoading(false);

            }
            const data = await response.json();
            
            setCandidates(data.msg);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchCandidates();
        }, []);

        const filteredCandidatesByStatus = filterStatus ? candidates.filter(cand => cand.status.toLowerCase() === filterStatus.toLowerCase()) : candidates;

        const filteredCandidatesByPosition = filterPosition ? filteredCandidatesByStatus.filter(cand=> cand.position.toLowerCase() === filterPosition.toLowerCase()) : filteredCandidatesByStatus;

        const filteredCandidates = searchQuery ? 
        filteredCandidatesByPosition.filter
        (cand=> cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.mobile.toString().includes(searchQuery)
        ) : filteredCandidatesByPosition;

    const handleStatusChange = async (id, newStatus) => {
        try {

            console.log("in status change");

            setCandidates((prev) =>
                prev.map((c) =>
                  c._id === id ? { ...c, status: newStatus } : c
                )
            );

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateCandidateStatus/${id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ status: newStatus }),
            });
        
            if (!res.ok) throw new Error("Failed to update status");
        
            
            setLoading(false);
          } catch (err) {
            console.error(err);
            setLoading(false);
            alert("Error updating candidate status");
            
          }
      };

    const downloadCv = async (cvPath) => {

        console.log("inside cv");

        const url = `${import.meta.env.VITE_BACKEND_URL}/downloadResume?resumePath=${encodeURIComponent(cvPath)}`;

        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        link.click();
    };

    if (loading) return <Loader />;

    return(
        <div>
                <h3>Candidates</h3>
                <div className="filtersParent">
                    <div className="filterSubParent">
                        <div className="filters">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Status</option>
                                <option value="New">New</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="filters">
                            <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
                                <option value="">Position</option>
                                <option value="Intern">Intern</option>
                                <option value="FullTime">Full Time</option>
                                <option value="Junior">Junior</option>
                                <option value="Senior">Senior</option>
                                <option value="TeamLead">Team Lead</option>
                            </select>
                        </div>
                    </div>
                    <div className="filterSubParent">
                        <div>
                            <input className="newsearch" type="text"  name="search" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} placeholder="Search Candidates"></input>
                        </div>
                        <div className="addCandidateBox">
                            <div className="addCandidate" onClick={() => setShowForm(true)}>Add Candidate</div>
                            {showForm && (
                                <FormModal onClose={() => setShowForm(false)}>
                                    <CandidateForm onClose={() => setShowForm(false)} onSuccess={fetchCandidates}/>
                                </FormModal>
                            )}
                        </div>
                    </div>
                </div>

                <div className="allContent">
                    <div className="subjects">
                        <div className=" subfield srnumber">Sr No.</div>
                        <div className=" subfield name">Candidates Name</div>
                        <div className="subfield email">Email Address</div>
                        <div className="subfield mobile">Phone Number</div>
                        <div className=" subfield position">Position</div>
                        <div className="subfield status">Status</div>
                        <div className="subfield experience">Experience</div>
                        <div className="subfield action">Action</div>
                    </div>
                    {filteredCandidates.length > 0 && filteredCandidates.map((candidate) => (
                        <div className="data" key={candidate._id}>
                            <div className=" subfield srnumber">{sNo++}</div>
                            <div className=" subfield name">{candidate.name}</div>
                            <div className="subfield email">{candidate.email}</div>
                            <div className="subfield mobile">{candidate.mobile}</div>
                            <div className=" subfield position">{candidate.position}</div>
                            <div className="subfield status">
                                <select className="org" value={candidate.status} onChange={(e) => handleStatusChange(candidate._id, e.target.value)}>
                                    <option value="">Status</option>
                                    <option value="New">New</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="subfield experience">{candidate.experience}</div>
                            <div className="subfield action" onClick={() => downloadCv(candidate.resume)}>CV</div>
                        </div>
                    ))}
                </div>
            </div>
    );
}

export default candidate;
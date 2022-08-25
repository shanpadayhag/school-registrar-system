import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Auth from '../../../auth/Auth';
import { AdminPage } from '../../../components';
import { DateHelper, StringManipulationHelper } from '../../../helpers';

const ShowRequestSectionGroup = styled.div`
    display: flex;
    grid-gap: 20px;

    &:not(:first-child) {
        margin-top: 20px;
    }
`;

const ShowRequestSection = styled.div`
    flex: 1;
    border: 1px solid #dfdfdf9b;
    background: #fff;
    border-radius: 10px;
    padding: 40px;
    display: flex;
    flex-direction: column;
`

const ShowRequestSectionHeader = styled.div`
    margin-bottom: 40px;
`

const ShowRequestSectionData = styled.div`
    display: flex;
    margin-bottom: 40px;

    &:last-child {
        margin-bottom: 0;
    }

    p {
        font-size: 14px;
    }
`

const ShowRequestSectionDataTitle = styled.h5`
    min-width: 250px;
`

const ShowRequest = () => {
    const params = useParams();

    const [name, setName] = useState('Loading...');
    const [program, setProgram] = useState('Loading...');
    const [yearLevel, setYearLevel] = useState('Loading...');
    const [yearGraduated, setYearGraduated] = useState('Loading...');
    const [requestedDocuments, setRequestedDocuments] = useState([]);
    const [deliveryOption, setDeliveryOption] = useState('Loading...');
    const [totalAmount, setTotalAmount] = useState('Loading...');
    const [staffHandledEntry, setStaffHandledEntry] = useState('Loading...');
    const [dateApprovedByEvaluator, setDateApprovedByEvaluator] = useState('Loading...');
    const [dateApprovedByRegistrar, setDateApprovedByRegistrar] = useState('Loading...');
    const [receivedBy, setRecievedBy] = useState('Loading...');

    const BreadCrumb = () => {
        return <>
            <li><Link to="/">Home</Link></li>
            <li className="divider">/</li>
            <li><Link to="/requests">Requests</Link></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Show</a></li>
        </>
    }

    const setEntryDetailStateValues = (details) => {
        setName(StringManipulationHelper.humanName(details[5], details[6], details[7]))
        setProgram(details[8])
        if (details[9] == 1 || details[9] == 2 || details[9] == 3 || details[9] == 4) {
            setYearLevel(StringManipulationHelper.yearLevel(details[9]))
            setYearGraduated('')
        } else {
            setYearLevel('')
            setYearGraduated(details[9])
        }

        const requestedDocumentsArray = details[11].split(' | ')
        setRequestedDocuments(requestedDocumentsArray)

        setDeliveryOption(details[16])
        setTotalAmount(details[14])
        setStaffHandledEntry(details[15])
        setDateApprovedByEvaluator(details[17])
        setDateApprovedByRegistrar(details[18])
        // setRecievedBy(details[9])
    }

    const displayEntryDetails = () => {
        const secrets = Auth.getAppsScriptSecrets();

        google.script.run
            .withSuccessHandler(setEntryDetailStateValues)
            .retrieveRequestDetails(params.id, secrets)
    }

    const requestedDocumentSentence = (value) => {
        const documentName = value.split(' ')[0];
        const quantity = value.split(' ')[1];
        const documentPieces = quantity?.stringBetween('[', ']');
        const documentAuthentication = quantity?.stringBetween('{', '}');

        const withAuth = documentAuthentication == 0;

        if (documentPieces !== null && value.split(' ').length > 1) {
            return `${documentName} ${documentPieces} pcs ${withAuth ? `with Authentication ${documentAuthentication}` : ``}`;
        } else {
            return value;
        }
    }

    useEffect(() => {
        displayEntryDetails()
    }, [])

    return <AdminPage title={`Request #${params.id}`} breadCrumb={<BreadCrumb />}>
        <ShowRequestSectionGroup>
            <ShowRequestSection>
                <ShowRequestSectionHeader>
                    <h2>User Information</h2>
                </ShowRequestSectionHeader>

                <div>
                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Name</ShowRequestSectionDataTitle>
                        <p>{name}</p>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Program</ShowRequestSectionDataTitle>
                        <p>{program}</p>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>{yearLevel === '' ? 'Year Graduated' : 'Year Level'}</ShowRequestSectionDataTitle>
                        <p>{yearLevel ?? yearGraduated}</p>
                    </ShowRequestSectionData>
                </div>
            </ShowRequestSection>

            <ShowRequestSection>
                <ShowRequestSectionHeader>
                    <h2>Application Information</h2>
                </ShowRequestSectionHeader>

                <div>
                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Control Number</ShowRequestSectionDataTitle>
                        <p>{params.id}</p>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Requested Documents</ShowRequestSectionDataTitle>

                        <div>
                            {requestedDocuments.map((value, index) => <p key={index}>
                                {requestedDocumentSentence(value)}
                            </p>)}
                        </div>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Delivery Option</ShowRequestSectionDataTitle>
                        <p>{deliveryOption}</p>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Total Amount</ShowRequestSectionDataTitle>
                        <p>{totalAmount ? `Php ${totalAmount}` : 'Free'}</p>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Staff Handled the Entry</ShowRequestSectionDataTitle>
                        <p>{staffHandledEntry}</p>
                    </ShowRequestSectionData>
                </div>
            </ShowRequestSection>
        </ShowRequestSectionGroup>

        <ShowRequestSectionGroup>
            <ShowRequestSection>
                <ShowRequestSectionHeader>
                    <h2>Application Status</h2>
                </ShowRequestSectionHeader>

                <div>
                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Date Approved by Evaluator</ShowRequestSectionDataTitle>
                        <p>{DateHelper.formatDateToHumanDate(dateApprovedByEvaluator)}</p>
                    </ShowRequestSectionData>

                    <ShowRequestSectionData>
                        <ShowRequestSectionDataTitle>Date Approved by Registrar</ShowRequestSectionDataTitle>
                        <p>{DateHelper.formatDateToHumanDate(dateApprovedByRegistrar)}</p>
                    </ShowRequestSectionData>

                    {receivedBy !== null || receivedBy !== 'Loading...'
                        ? <ShowRequestSectionData>
                            <ShowRequestSectionDataTitle>Received by</ShowRequestSectionDataTitle>
                            <p>{receivedBy}</p>
                        </ShowRequestSectionData>
                        : null}
                </div>
            </ShowRequestSection>
        </ShowRequestSectionGroup>
    </AdminPage>;
};

export default ShowRequest;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Auth from "../../../auth/Auth";
import { AdminPage, Button, DropdownInput, InputField, LinkButton, Snackbar } from "../../../components";
import { DateHelper, ObjectHelper } from "../../../helpers";

const AllRequestSearchForm = styled.form`
    display: flex;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    font-size: 14px;

    align-items: end;
`;

const AllRequestDataContainer = styled.div`
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
`

const AllRequestDataHeader = styled.h3`
    margin-bottom: 20px;
`

const AllRequestTable = styled.table`
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;

    th, td {
        border-bottom: 1px solid #cacaca3e;
        padding: 10px 20px;
        background-color: #f8f8ff;
    }

    th:first-child {
            border-start-start-radius: 10px;
    }

    th:last-child {
            border-start-end-radius: 10px;
    }

    th {
        text-align: left;
        padding: 20px;
    }

    td {
        background-color: #fff;
    }

    tr:last-child>td {
        border: none;
    }
`

const AllRequests = () => {
    const [searchId, setSearchId] = useState('');
    const [searchCategory, setSearchCategory] = useState('CONTROL NUMBER');
    const [searchedEntries, setSearchedEntries] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const searchEntry = (event) => {
        event.preventDefault();
    }

    const BreadCrumb = () => {
        return <>
            <li><Link to="/">Home</Link></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Requests</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">All</a></li>
        </>
    }

    const searchEntriesSuccessHandler = (values) => {
        setSearchedEntries(values)

        if (values.length < 1) {
            setSnackbarMessage('No entry found')
            const snackbarElement = $('#allRequestSnackbar')
            snackbarElement.toggleClass('show')

            setTimeout(() => {
                snackbarElement.toggleClass('show')
            }, 3000)
        }
    }

    const searchEntries = () => {
        const secrets = Auth.getAppsScriptSecrets();

        if (searchId?.length > 0) {
            google.script.run
                .withSuccessHandler(searchEntriesSuccessHandler)
                .searchRequest(searchId, searchCategory, secrets)
        } else {
            setSnackbarMessage('Invalid input')
            const snackbarElement = $('#allRequestSnackbar')
            snackbarElement.toggleClass('show')

            setTimeout(() => {
                snackbarElement.toggleClass('show')
            }, 3000)
        }
    }

    return <AdminPage title="All Requests" breadCrumb={<BreadCrumb />}>
        <AllRequestSearchForm onSubmit={searchEntry}>
            <InputField type="text"
                value={searchId}
                setValue={setSearchId}
                containerStyle={{ minWidth: 320, width: '100%' }}
                leftBoxIcon="bx-search"
                placeholder="Search for control number or name"
                title="What are you looking for?" />

            <DropdownInput
                style={{ maxWidth: 240, }}
                title="Category"
                id="searchCategory"
                value={searchCategory}
                setValue={setSearchCategory}>

                <option label="Control Number">CONTROL NUMBER</option>
                <option label="Name">NAME</option>
            </DropdownInput>

            <Button onClick={searchEntries}>Search</Button>
        </AllRequestSearchForm>

        <AllRequestDataContainer>
            <AllRequestDataHeader>Request Entries</AllRequestDataHeader>

            <AllRequestTable>
                <thead>
                    <tr>
                        <th>Control Number</th>
                        <th>Full Name</th>
                        <th>Request Date</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {searchedEntries.length > 0 ? searchedEntries.map((entry, index) => {
                        const controlNumber = ObjectHelper.alternativeValueIfEmpty(entry[0], ObjectHelper.alternativeValueIfEmpty(entry[1], entry[2]));

                        return (
                            <tr key={index}>
                                <td>{controlNumber}</td>
                                <td>{`${entry[5]}, ${entry[6]} ${entry[7]}`}</td>
                                <td>{DateHelper.formatDateToHumanDate(entry[3])}</td>
                                <td><LinkButton to={`/requests/${controlNumber}`}>View</LinkButton></td>
                            </tr>
                        )
                    }) : <tr>
                        <td></td>
                        <td>There are no entries found</td>
                        <td></td>
                        <td></td>
                    </tr>}
                </tbody>
            </AllRequestTable>
        </AllRequestDataContainer>

        <Snackbar id="allRequestSnackbar">{snackbarMessage}</Snackbar>
    </AdminPage >
}

export default AllRequests;

// PersonCard.js
// ---------------------------------------------------------------------------
// Draws ONE user exactly like the handout's "Output format" screenshot:
//   teal card, header "Title First Last - uuid", round photo + Details button
//   on the left, label/value rows on the right.
// It is a "dumb" component: it only receives a person and renders it.
// ---------------------------------------------------------------------------
import React, { useState } from 'react';
import { Button, Card, Col, Collapse, Image, Row } from 'react-bootstrap';

// Turns randomuser.me's nested location object into one readable line:
// "4638 North Street, Truro, South Glamorgan, United Kingdom - LP5 6QN"
export function formatAddress(location = {}) {
  const street = location.street
    ? `${location.street.number} ${location.street.name}`
    : '';
  const placeParts = [street, location.city, location.state, location.country]
    .filter(Boolean)
    .join(', ');
  return location.postcode ? `${placeParts} - ${location.postcode}` : placeParts;
}

// One label/value line. Labels are right-aligned like the screenshot.
function InfoRow({ label, children }) {
  return (
    <Row className="mb-3">
      <Col xs={5} md={4} lg={3} className="text-end fw-light">
        {label}:
      </Col>
      <Col className="text-break">{children}</Col>
    </Row>
  );
}

export default function PersonCard({ person }) {
  // Details button toggles the extra info panel (open/closed).
  const [showDetails, setShowDetails] = useState(false);

  const { name, login, gender, location, email, dob, registered, phone, cell, picture, nat } =
    person;
  const fullName = `${name.title} ${name.first} ${name.last}`;
  const detailsPanelId = `details-${login.uuid}`;

  return (
    <Card bg="info" className="person-card mb-3 shadow-sm" data-testid="person-card">
      <Card.Header className="fw-bold">
        {fullName} - {login.uuid}
      </Card.Header>

      <Card.Body>
        <Row>
          {/* Left column: photo + Details button */}
          <Col md={3} className="text-center mb-3">
            <Image
              src={picture.large}
              alt={`Portrait of ${name.first} ${name.last}`}
              roundedCircle
              className="person-photo mb-3"
            />
            <div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowDetails((wasOpen) => !wasOpen)}
                aria-controls={detailsPanelId}
                aria-expanded={showDetails}
              >
                {showDetails ? 'Hide' : 'Details'}
              </Button>
            </div>
          </Col>

          {/* Right column: the label/value rows from the screenshot */}
          <Col md={9}>
            <InfoRow label="User Name">
              <span className="fs-5">{login.username}</span>
            </InfoRow>
            <InfoRow label="Gender">{gender.toUpperCase()}</InfoRow>
            <InfoRow label="Time Zone Description">{location.timezone?.description}</InfoRow>
            <InfoRow label="Address">{formatAddress(location)}</InfoRow>
            <InfoRow label="Email">{email}</InfoRow>
            <InfoRow label="Birth Date and Age">
              {dob.date} ({dob.age})
            </InfoRow>
            <InfoRow label="Register Date">{registered.date}</InfoRow>
            <InfoRow label="Phone#">{phone}</InfoRow>
            <InfoRow label="Cell#">{cell}</InfoRow>

            {/* Extra info revealed by the Details button */}
            <Collapse in={showDetails}>
              <div id={detailsPanelId}>
                <hr />
                <InfoRow label="Nationality">{nat}</InfoRow>
                <InfoRow label="Coordinates">
                  {location.coordinates?.latitude}, {location.coordinates?.longitude}
                </InfoRow>
                <InfoRow label="Member For">{registered.age} years</InfoRow>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

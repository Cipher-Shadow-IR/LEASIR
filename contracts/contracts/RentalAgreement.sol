// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RentalAgreement {
    enum AgreementState { Pending, Active, Terminated, Disputed, Completed }

    enum PaymentStatus { Unpaid, Paid, Overdue }

    struct Agreement {
        uint256 id;
        address landlord;
        address tenant;
        uint256 rentAmount;
        uint256 securityDeposit;
        uint256 startDate;
        uint256 endDate;
        uint256 gracePeriod;
        AgreementState state;
    }

    struct Payment {
        uint256 agreementId;
        uint256 amount;
        uint256 dueDate;
        uint256 paidDate;
        PaymentStatus status;
        address payer;
    }

    uint256 private _nextAgreementId;
    uint256 private _nextPaymentId;

    mapping(uint256 => Agreement) private _agreements;
    mapping(uint256 => Payment) private _payments;
    mapping(uint256 => uint256[]) private _agreementPayments;
    mapping(address => uint256[]) private _landlordAgreements;
    mapping(address => uint256[]) private _tenantAgreements;

    event AgreementCreated(
        uint256 indexed id,
        address indexed landlord,
        address indexed tenant,
        uint256 rentAmount,
        uint256 securityDeposit,
        uint256 startDate,
        uint256 endDate
    );

    event AgreementActivated(uint256 indexed id);
    event RentPaid(uint256 indexed agreementId, uint256 indexed paymentId, uint256 amount, address payer);
    event DepositRefunded(uint256 indexed agreementId, address indexed tenant, uint256 amount);
    event DisputeRaised(uint256 indexed agreementId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed agreementId, bool tenantFavored);
    event AgreementTerminated(uint256 indexed agreementId);

    modifier onlyLandlord(uint256 agreementId) {
        require(msg.sender == _agreements[agreementId].landlord, "Only landlord");
        _;
    }

    modifier onlyTenant(uint256 agreementId) {
        require(msg.sender == _agreements[agreementId].tenant, "Only tenant");
        _;
    }

    modifier onlyParties(uint256 agreementId) {
        Agreement storage a = _agreements[agreementId];
        require(msg.sender == a.landlord || msg.sender == a.tenant, "Not a party");
        _;
    }

    modifier inState(uint256 agreementId, AgreementState expected) {
        require(_agreements[agreementId].state == expected, "Invalid state");
        _;
    }

    function createAgreement(
        address _tenant,
        uint256 _rentAmount,
        uint256 _securityDeposit,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _gracePeriod
    ) external returns (uint256) {
        require(_tenant != address(0), "Invalid tenant");
        require(_rentAmount > 0, "Rent must be > 0");
        require(_startDate < _endDate, "Invalid dates");
        require(_endDate > block.timestamp, "End date must be in future");
        require(msg.sender != _tenant, "Cannot be both parties");
        require(_gracePeriod > 0, "Grace period required");

        uint256 agreementId = _nextAgreementId++;

        _agreements[agreementId] = Agreement({
            id: agreementId,
            landlord: msg.sender,
            tenant: _tenant,
            rentAmount: _rentAmount,
            securityDeposit: _securityDeposit,
            startDate: _startDate,
            endDate: _endDate,
            gracePeriod: _gracePeriod,
            state: AgreementState.Pending
        });

        _landlordAgreements[msg.sender].push(agreementId);
        _tenantAgreements[_tenant].push(agreementId);

        emit AgreementCreated(agreementId, msg.sender, _tenant, _rentAmount, _securityDeposit, _startDate, _endDate);

        return agreementId;
    }

    function acceptAgreement(uint256 agreementId) external onlyTenant(agreementId) inState(agreementId, AgreementState.Pending) {
        Agreement storage a = _agreements[agreementId];
        require(block.timestamp <= a.endDate, "Agreement expired");

        a.state = AgreementState.Active;
        emit AgreementActivated(agreementId);
    }

    function payRent(uint256 agreementId) external payable {
        Agreement storage a = _agreements[agreementId];
        require(a.state == AgreementState.Active, "Not active");
        require(msg.sender == a.tenant, "Only tenant pays rent");
        require(msg.value == a.rentAmount, "Exact rent required");

        uint256 paymentId = _nextPaymentId++;
        _payments[paymentId] = Payment({
            agreementId: agreementId,
            amount: msg.value,
            dueDate: block.timestamp,
            paidDate: block.timestamp,
            status: PaymentStatus.Paid,
            payer: msg.sender
        });

        _agreementPayments[agreementId].push(paymentId);

        (bool sent,) = a.landlord.call{value: msg.value}("");
        require(sent, "Transfer failed");

        emit RentPaid(agreementId, paymentId, msg.value, msg.sender);
    }

    function raiseDispute(uint256 agreementId) external onlyParties(agreementId) {
        Agreement storage a = _agreements[agreementId];
        require(a.state == AgreementState.Active || a.state == AgreementState.Terminated, "Cannot dispute");

        a.state = AgreementState.Disputed;
        emit DisputeRaised(agreementId, msg.sender);
    }

    function resolveDispute(uint256 agreementId, bool tenantFavored) external {
        Agreement storage a = _agreements[agreementId];
        require(a.state == AgreementState.Disputed, "Not disputed");

        if (tenantFavored) {
            uint256 deposit = a.securityDeposit;
            a.securityDeposit = 0;
            (bool sent,) = a.tenant.call{value: deposit}("");
            require(sent, "Refund failed");
        } else {
            (bool sent,) = a.landlord.call{value: a.securityDeposit}("");
            require(sent, "Transfer failed");
            a.securityDeposit = 0;
        }

        a.state = AgreementState.Completed;
        emit DisputeResolved(agreementId, tenantFavored);
    }

    function refundDeposit(uint256 agreementId) external onlyLandlord(agreementId) inState(agreementId, AgreementState.Terminated) {
        Agreement storage a = _agreements[agreementId];
        uint256 deposit = a.securityDeposit;
        require(deposit > 0, "No deposit");

        a.securityDeposit = 0;
        a.state = AgreementState.Completed;

        (bool sent,) = a.tenant.call{value: deposit}("");
        require(sent, "Refund failed");

        emit DepositRefunded(agreementId, a.tenant, deposit);
    }

    function terminateAgreement(uint256 agreementId) external onlyLandlord(agreementId) inState(agreementId, AgreementState.Active) {
        Agreement storage a = _agreements[agreementId];
        require(block.timestamp >= a.endDate, "Term not ended");

        a.state = AgreementState.Terminated;
        emit AgreementTerminated(agreementId);
    }

    function getAgreement(uint256 agreementId) external view returns (Agreement memory) {
        require(agreementId < _nextAgreementId, "Does not exist");
        return _agreements[agreementId];
    }

    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        require(paymentId < _nextPaymentId, "Does not exist");
        return _payments[paymentId];
    }

    function getAgreementPayments(uint256 agreementId) external view returns (uint256[] memory) {
        return _agreementPayments[agreementId];
    }

    function getLandlordAgreements(address landlord) external view returns (uint256[] memory) {
        return _landlordAgreements[landlord];
    }

    function getTenantAgreements(address tenant) external view returns (uint256[] memory) {
        return _tenantAgreements[tenant];
    }

    function agreementExists(uint256 agreementId) external view returns (bool) {
        return agreementId < _nextAgreementId;
    }

    function getCurrentTimestamp() external view returns (uint256) {
        return block.timestamp;
    }
}

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalAgreement", function () {
  let RentalAgreement, contract, landlord, tenant, other;
  const RENT = ethers.parseEther("1");
  const DEPOSIT = ethers.parseEther("2");
  const GRACE = 7 * 86400;

  beforeEach(async function () {
    [landlord, tenant, other] = await ethers.getSigners();
    RentalAgreement = await ethers.getContractFactory("RentalAgreement");
    contract = await RentalAgreement.deploy();
    await contract.waitForDeployment();
  });

  const now = () => Math.floor(Date.now() / 1000);
  const future = (s) => now() + s;

  describe("Agreement Creation", function () {
    it("should create an agreement", async function () {
      const tx = await contract.connect(landlord).createAgreement(
        tenant.address, RENT, DEPOSIT, future(100), future(86400 * 30), GRACE
      );
      const receipt = await tx.wait();

      const agreement = await contract.getAgreement(0);
      expect(agreement.landlord).to.equal(landlord.address);
      expect(agreement.tenant).to.equal(tenant.address);
      expect(agreement.rentAmount).to.equal(RENT);
      expect(agreement.state).to.equal(0);
    });

    it("should reject zero tenant", async function () {
      await expect(
        contract.connect(landlord).createAgreement(
          ethers.ZeroAddress, RENT, DEPOSIT, future(100), future(86400 * 30), GRACE
        )
      ).to.be.revertedWith("Invalid tenant");
    });

    it("should reject zero rent", async function () {
      await expect(
        contract.connect(landlord).createAgreement(
          tenant.address, 0, DEPOSIT, future(100), future(86400 * 30), GRACE
        )
      ).to.be.revertedWith("Rent must be > 0");
    });
  });

  describe("Agreement Lifecycle", function () {
    beforeEach(async function () {
      await contract.connect(landlord).createAgreement(
        tenant.address, RENT, DEPOSIT, future(100), future(86400 * 30), GRACE
      );
    });

    it("should accept agreement", async function () {
      await contract.connect(tenant).acceptAgreement(0);
      const agreement = await contract.getAgreement(0);
      expect(agreement.state).to.equal(1);
    });

    it("should pay rent", async function () {
      await contract.connect(tenant).acceptAgreement(0);
      await contract.connect(tenant).payRent(0, { value: RENT });
      const payments = await contract.getAgreementPayments(0);
      expect(payments.length).to.equal(1);
    });

    it("should raise dispute", async function () {
      await contract.connect(tenant).acceptAgreement(0);
      await contract.connect(tenant).raiseDispute(0);
      const agreement = await contract.getAgreement(0);
      expect(agreement.state).to.equal(3);
    });

    it("should terminate after end date", async function () {
      await contract.connect(tenant).acceptAgreement(0);
      const agreement = await contract.getAgreement(0);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(agreement.endDate) + 1]);
      await ethers.provider.send("evm_mine");
      await contract.connect(landlord).terminateAgreement(0);
      const updated = await contract.getAgreement(0);
      expect(updated.state).to.equal(2);
    });
  });
});

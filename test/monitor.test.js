const { Types } = require("mongoose");
const monitorController = require("../controllers/monitorController");
const sinon = require("sinon");
const { expect } = require("chai");
const Monitor = require("../models/Monitor");

describe("Monitor Service Unit Tests", function () {
	const name = "My Monitor";
	const description = "Test Monitor for Mocha";
	const monitorData = [];
	const average = 0;
	const alarms = [];
	const user = new Types.ObjectId();
	const mockMonitor = {
		_id: 1,
		name: name,
		description: description,
		monitorData: monitorData,
		average: average,
		alarms: alarms,
		user: user,
	};
	describe("Save Monitor functionality", function () {
		let req, res;
		beforeEach(() => {
			req = {
				body: function (data) {
					return this;
				},
				params: function (id) {
					return this;
				},
			};
			res = {
				send: function () {},
				json: function () {},
				status: function (s) {
					this.statusCode = s;
					return this;
				},
			};
		});

		it("should get all monitors", async function () {
			sinon.stub(Monitor, "find").callsFake(function () {
				return [];
			});

			const monitors = await monitorController.getMonitors(req, res);

			expect(monitors).to.have.lengthOf(0);
		});

		it("should successfully get a monitor", async function () {
			sinon.stub(Monitor, "findById").returns(mockMonitor);

			const mon = await monitorController.getMonitor(req.params(1), res);
			expect(mon).to.equal(mockMonitor);
		});

		it("should successfully add a monitor", async function () {
			sinon.stub(Monitor, "create").returns(mockMonitor);
			const returnedMonitor = await monitorController.addMonitor(
				req.body(mockMonitor),
				res
			);

			expect(returnedMonitor.name).to.equal(name);
			expect(returnedMonitor.description).to.equal(description);
		});

		it("should successfully delete a monitor", async function () {
			sinon.stub(Monitor, "findByIdAndDelete").returns(mockMonitor);

			const returnedMonitor = await monitorController.deleteMonitor(
				req.params(1),
				res
			);

			expect(returnedMonitor).to.equal(mockMonitor);
		});
	});
});

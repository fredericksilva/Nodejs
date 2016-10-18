'use strict';

class InboundController
{
    /**
     * @constructor
     *
     * @param inboundService
     * @param userService
     * @param logger
     */
    constructor(inboundService, userService, logger)
    {
        this.inboundService = inboundService;
        this.userService = userService;
        this.logger = logger;
    }

    /**
     * view a paginated summary of all inbound batches.
     *
     * @param req
     * @param res
     */
    index(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Inbound Service',
            menuActive: 'inbound',
            contentHead: 'Inbound Service'
        };

        let params = {};
        let q = req.query.q;
        let page = req.query.page;

        if (!this.userService.isSuperAdmin(req.user)) {
            params.warehouse = this.userService.getWarehouse(req.user);
        }

        if (q) {
            params.batch_number = q;
            viewData.q = q;
        }

        if (page) {
            params.page = page;
        }

        this.inboundService.fetchBatches(params).then((data) => {
            viewData.batches = data.batches;
            viewData.pagination = data.pagination;
            return res.render('inbound', viewData);
        }).catch(() => {
            req.flash('error', 'An error occurred while trying to fetch batches');
            return res.render('inbound', viewData);
        });
    }

    /**
     * view the details of a batch.
     *
     * @param req
     * @param res
     */
    detail(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Inbound Service',
            menuActive: 'inbound',
            contentHead: 'Inbound Service - Details'
        };

        let batchNo = req.params.id;
        viewData.batchNo = batchNo;

        this.inboundService.fetchBatch(batchNo).then((data) => {
            viewData.batch = data;
            return res.render('inbound_detail', viewData);
        }).catch(() => {
            req.flash('error', 'An error occurred while trying to the batch details');
            return res.render('inbound_detail', viewData);
        });
    }
}

module.exports = InboundController;

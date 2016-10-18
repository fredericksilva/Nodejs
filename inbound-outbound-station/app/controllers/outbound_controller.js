'use strict';

class OutboundController
{
    /**
     * @constructor
     *
     * @param outboundService
     * @param userService
     * @param logger
     */
    constructor(outboundService, userService, logger)
    {
        this.outboundService = outboundService;
        this.userService = userService;
        this.logger = logger;
    }

    /**
     * outbound batch listing
     *
     * @param req
     * @param res
     */
    index(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Inbound Service',
            menuActive: 'outbound',
            contentHead: 'Outbound Service'
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

        this.outboundService.fetchBatches(params).then((data) => {
            viewData.batches = data.batches;
            viewData.pagination = data.pagination;
            return res.render('outbound', viewData);
        }).catch(() => {
            req.flash('error', 'An error occurred while trying to fetch batches');
            return res.render('outbound', viewData);
        });
    }

    /**
     * view outbound batch
     *
     * @param req
     * @param res
     */
    view(req, res) {
        let viewData = {
            pageTitle: 'Konga SRN - Outbound Service',
            menuActive: 'outbound',
            contentHead: 'Outbound Service - Details'
        };

        let batchNo = req.params.outId;
        viewData.batchNo = batchNo;

        this.outboundService.fetchBatch(batchNo).then((data) => {
            viewData.batch = data;
            return res.render('outbound_view', viewData);
        }).catch(() => {
            req.flash('error', 'An error occurred while trying to the batch details');
            return res.render('outbound_view', viewData);
        });
    }
}

module.exports = OutboundController;

const asyncHandler = require('express-async-handler')

const Ticket = require('../models/ticketModel')
const Service = require('../models/serviceModel');
const mongoose = require('mongoose');
const sendEmail = require('../utils/emailService');
const User = require('../models/userModel')

// NOTE: no need to get the user, we already have them on req object from
// protect middleware. The protect middleware already checks for valid user.

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id })

  res.status(200).json(tickets)
})

// @desc    Get user ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  /*if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }*/

  res.status(200).json(ticket)
})

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const { service: serviceId, titre, description } = req.body;

  if (!serviceId || !titre || !description) {
    res.status(400);
    throw new Error('Veuillez ajouter un titre et une description');
  }
  const service = await Service.findById(serviceId); 

  if (!service) {
    res.status(404);
    throw new Error('Service non trouvé');
  }
  const agentId = service.responsibleAgent;
  const ticket = await Ticket.create({
    service: serviceId, 
    titre,
    description,
    user: req.user.id,
    status: 'new',
    responsibleAgent: agentId 
  });
   // Send email to the responsible agent
   if (agentId) {
    const agent = await User.findById(agentId);
    const link = `http://localhost:5173/login`
    if (agent) {
      sendEmail(agent.email, 'New Ticket Created', `A new ticket has been created with the following details:\nTitle: ${titre}\nDescription: ${description}\nLien:${link}`);
    }
  }
  res.status(201).json(ticket);
});

// @desc    Get tickets by service
// @route   GET /api/tickets/service/:serviceId
// @access  Private (only for admins or agents, adjust as needed)
const getTicketsByService = asyncHandler(async (req, res) => {
  const serviceId = req.params.serviceId;
  
  // Check if the user is authorized to access tickets for this service
  // Add your authorization logic here, e.g., check if the user is an admin or an agent
  
  const tickets = await Ticket.find({ service: serviceId });

  res.status(200).json(tickets);
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  await ticket.remove()

  res.status(200).json({ success: true })
})

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicketDescription = asyncHandler(async (req, res) => {
  const { description } = req.body;

  const ticket = await Ticket.findById(req.params.id);

  if (ticket) {
    ticket.description = description || ticket.description; // Assurez-vous que la nouvelle description n'est pas vide
    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } else {
    res.status(404);
    throw new Error('Ticket not found');
  }
});

//close ticket
// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }
  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  // Send email to the client if the ticket status is closed
  if (req.body.status === 'closed') {
    const user = await User.findById(ticket.user);
    if (user) {
      const Url="http://localhost:5173/employe-note";
      sendEmail(user.email, 'Ticket Closed', `Your ticket with the title "${ticket.titre}" has been closed.\nLien:${Url}`);
    }
  }
  res.status(200).json(updatedTicket)
})

// @desc    Get user tickets by agent
// @route   GET /api/tickets/agent
// @access  Private
const getTicketsByAgent = asyncHandler(async (req, res) => {
  const agentId = req.user.id; // ID de l'agent actuellement connecté
  
  const tickets = await Ticket.find({ responsibleAgent: agentId });

  res.status(200).json(tickets);
});

// @desc    Get ticket statistics
// @route   GET /api/tickets/stats
// @access  Private
const getTicketStats = asyncHandler(async (req, res) => {
  const totalTickets = await Ticket.countDocuments();
  const ticketNew = await Ticket.countDocuments({ status: 'new' });
  const ticketClosed = await Ticket.countDocuments({ status: 'closed' });

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based
  const currentYear = currentDate.getFullYear();

  // Get tickets closed in the current month
  const ticketClosedCurrentMonth = await Ticket.aggregate([
    {
      $match: {
        status: 'closed',
        $expr: {
          $and: [
            { $eq: [{ $month: '$createdAt' }, currentMonth] },
            { $eq: [{ $year: '$createdAt' }, currentYear] }
          ]
        }
      }
    },
    {
      $count: 'totalClosed'
    }
  ]);

  const totalClosedCurrentMonth = ticketClosedCurrentMonth.length > 0 ? ticketClosedCurrentMonth[0].totalClosed : 0;

  res.status(200).json({
    totalTickets,
    ticketNew,
    ticketClosed,
    totalClosedCurrentMonth
  });
});


const getTicketStatsByAgentAndService = async (req, res) => {
  try {
    const { agentId, serviceId } = req.params;
    const totalTickets = await Ticket.countDocuments({ responsibleAgent: agentId, service: serviceId });
    const ticketNew = await Ticket.countDocuments({ responsibleAgent: agentId, service: serviceId, status: 'new' });
    const ticketClosed = await Ticket.countDocuments({ responsibleAgent: agentId, service: serviceId, status: 'closed' });

    // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();
  // Get tickets closed in the current month
  const ticketClosedCurrentMonth = await Ticket.aggregate([
    {
      $match: {
        status: 'closed',
        responsibleAgent: mongoose.Types.ObjectId(agentId),
          service: mongoose.Types.ObjectId(serviceId),
        $expr: {
          $and: [
            { $eq: [{ $month: '$createdAt' }, currentMonth] },
            { $eq: [{ $year: '$createdAt' }, currentYear] }
          ]
        }
      }
    },
    {
      $count: 'totalClosed'
    }
  ]);

  const totalClosedCurrentMonth = ticketClosedCurrentMonth.length > 0 ? ticketClosedCurrentMonth[0].totalClosed : 0;

    res.json({
      totalTickets,
      ticketNew,
      ticketClosed,
      totalClosedCurrentMonth,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Unable to get ticket statistics' });
  }
};


const getMonthlyTicketStats = asyncHandler(async (req, res) => {
  try {
    const monthlyStats = await Ticket.aggregate([
      {
        $match: {
          status: 'closed'
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalClosed: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    const monthsMap = {
      1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
      7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
    };
    
    const monthlyStatsFormatted = monthlyStats.map(stat => ({
      name: monthsMap[stat._id],
      totalClosed: stat.totalClosed
    }));
    
    res.json(monthlyStatsFormatted);
  } catch (error) {
    console.error('Failed to fetch monthly ticket stats:', error);
    res.status(500).json({ message: 'Failed to fetch monthly ticket stats' });
  }
});

// @desc    Get agent ranking by closed tickets
// @route   GET /api/tickets/agentRanking
// @access  Private
const getAgentRanking = asyncHandler(async (req, res) => {
  const ranking = await Ticket.aggregate([
    {
      $match: {
        status: { $in: ['new', 'closed'] }
      }
    },
    {
      $group: {
        _id: '$responsibleAgent',
        closedTickets: {
          $sum: {
            $cond: [{ $eq: ['$status', 'closed'] }, 1, 0]
          }
        },
        totalTickets: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'agent'
      }
    },
    {
      $unwind: '$agent'
    },
    {
      $project: {
        _id: 0,
        agentId: '$_id',
        closedTickets: 1,
        totalTickets: 1,
        email: '$agent.email',
        name: '$agent.name'
      }
    },
    {
      $sort: { closedTickets: -1 }
    }
  ]);

  res.status(200).json(ranking);
});

// @desc    Get monthly ticket stats by agent
// @route   GET /api/tickets/stats/monthlyStatsByAgent/:agentId/:serviceId
// @access  Private
const getMonthlyTicketStatsByAgent = asyncHandler(async (req, res) => {
  try {
    const { agentId, serviceId } = req.params;

    const monthlyStats = await Ticket.aggregate([
      {
        $match: {
          status: 'closed',
          responsibleAgent: mongoose.Types.ObjectId(agentId),
          service: mongoose.Types.ObjectId(serviceId)
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalClosed: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const monthsMap = {
      1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
      7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
    };

    const monthlyStatsFormatted = monthlyStats.map(stat => ({
      name: monthsMap[stat._id],
      totalClosed: stat.totalClosed
    }));

    res.json(monthlyStatsFormatted);
  } catch (error) {
    console.error('Error fetching monthly ticket stats:', error);
    res.status(500).json({ message: 'Failed to fetch monthly ticket stats' });
  }
});


// @desc    Get service ID by agent
// @route   GET /api/tickets/stats/service
// @access  Private
const getServiceByAgent = asyncHandler(async (req, res) => {
  const agentId = req.user.id; 
  
  const service = await Service.findOne({ responsibleAgent: agentId });

  if (!service) {
    res.status(404);
    throw new Error('Service  not found for the authenticated agent');
  }

  res.status(200).json({ serviceId: service._id });
});

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicketDescription,
  updateTicket,
  getTicketsByService,
  getTicketsByAgent,
  getTicketStats,
  getTicketStatsByAgentAndService,
  getMonthlyTicketStats,
  getAgentRanking,
  getMonthlyTicketStatsByAgent,
  getServiceByAgent,
}

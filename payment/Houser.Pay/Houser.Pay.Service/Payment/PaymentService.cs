﻿using AutoMapper;
using Houser.Pay.Model.Payment;
using MongoDB.Driver;
using System;
using System.Collections.Generic;

namespace Houser.Pay.Service.Payment
{
    public class PaymentService : IPaymentService
    {
        private IMongoCollection<DB.Entities.Payment> paymentCollection;
        private readonly IMapper mapper;
        public PaymentService( IMongoClient client, IMapper _mapper )
        {
            var database = client.GetDatabase("Houser");
            paymentCollection = database.GetCollection<DB.Entities.Payment>("Payments");
            mapper = _mapper;
        }
        public IEnumerable<PaymentViewModel> Get()
        {
            var result = new List<PaymentViewModel>();
            var data = paymentCollection.Find(p => true).ToList();
            if ( data is null ) return result;
            result = mapper.Map<List<PaymentViewModel>>(data);
            return result;
        }
        public IEnumerable<PaymentViewModel> GetByUserId( int userId )
        {
            var result = new List<PaymentViewModel>();
            var data = paymentCollection.Find(p => p.UserId == userId).ToList();
            if ( data is null ) return result;
            result = mapper.Map<List<PaymentViewModel>>(data);
            return result;
        }
        public bool Insert( PaymentInsertModel insertPayment )
        {
            bool result = false;
            var data = mapper.Map<DB.Entities.Payment>(insertPayment);
            data.PaymentDate = DateTime.Now;
            paymentCollection.InsertOne(data);
            result = true;
            return result;
        }
    }
}
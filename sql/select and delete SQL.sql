/****** Script for SelectTopNRows command from SSMS  ******/
select top 4 * from [dbo].[T_ISSUED_CHEQUES] order by f_Id desc
select top 4 * from [dbo].[T_Payment_Voucher] order by F_Id desc
SELECT top 4 *   FROM T_Account_Transactions order by F_ID desc


  
delete from CustomersChqs where id>1085
delete from Collections where id >4726
delete journalentry where journalentryid > 613
   
delete from [t_Purchase_vouchers] where f_id>706
delete from t_invoice where f_id >5241
delete from t_account_transactions where f_id>23686
delete from T_Accounts_Master where f_id>493
delete from T_customers where f_id>709
delete  from T_Suppliers where f_id>17




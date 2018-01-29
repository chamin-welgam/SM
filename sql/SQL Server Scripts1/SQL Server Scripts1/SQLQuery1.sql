use SM_769068897;

set identity_insert t_accountsmaster on;
insert into T_AccountsMaster
(F_ID, F_AccCd,F_AccNm,F_ParentAccID)
select RecordID,AccountCode,AccountName,ParentAccount from OASO.dbo.AccountsMaster




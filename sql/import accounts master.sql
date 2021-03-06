--FIRST CREATE A FILED IN ACCOUNTS MASTER TO HOLD SM RECORD ID
ALTER TABLE T_Accounts_Master  ADD SM_id INT null;
GO

declare @sm_id int, @f_id int; 
declare @parentID int=1;
declare @code varchar(100), @nm varchar(100)
declare am cursor for 
select F_AccCd, F_AccNm, F_ParentAccID , f_id from T_Accounts_Master tam order by F_AccCd;
open am;
FETCH NEXT FROM am INTO @code, @nm ,@parentid ,@f_id;
BEGIN TRY
	begin tran
	WHILE @@FETCH_STATUS = 0  
	BEGIN  
		if (@parentID>0)  begin
			select @parentID= sm_id from T_Accounts_Master where f_id=@parentID
		end	else begin
			set @parentID=null
		end
		exec @sm_id =fun_159 @f_92=@code, @f_93=@nm , @f_94=0, @F_95=@parentID;
		update T_Accounts_Master set sm_id=@sm_id where f_id=@f_id;

		FETCH NEXT FROM am INTO @code, @nm ,@parentid ,@f_id;
	end
	commit tran;
end try
BEGIN CATCH
        DECLARE @MSG NVARCHAR(MAX), @SEV INT  ;
        SELECT @MSG=ERROR_MESSAGE() ;
        SELECT @SEV= ERROR_SEVERITY();
        IF @@TRANCOUNT > 0 BEGIN
            ROLLBACK TRAN --RollBack in case of Error
        END
        RAISERROR(@MSG,@SEV , 1);
END CATCH
close am;
deallocate am;
go
--select * from T_Accounts_Master order by f_acccd


SELECT TOP (1000) [F_ID]
      ,[F_92]
      ,[F_93]
      ,[F_94]
      ,[F_95]
  FROM [SM_769068897].[dbo].[T_15] order by f_92

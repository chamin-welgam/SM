USE [SM_769068897]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		SM
-- Create date: 20YY-MM-DD
-- Description:	<> 
-- =============================================
CREATE PROCEDURE [dbo].[SP_<SP NAME>](
	-- Add the parameters for the stored procedure here
	)
AS
	-- YOUR VARIABLES HERE
	-- DECLARE ;  
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		--<CODE GOES HERE>

	END TRY
	BEGIN CATCH
        DECLARE @Msg NVARCHAR(MAX), @sev int  ;
        SELECT @Msg=ERROR_MESSAGE() ;
		SELECT @sev= ERROR_SEVERITY();
		IF @@TRANCOUNT > 0 begin
			ROLLBACK TRAN --RollBack in case of Error
		end
		RAISERROR(@Msg,@sev , 1);
	END CATCH
END
GO

GRANT EXECUTE ON OBJECT::SP_<SP NAME> TO SM_769068897 AS dbo

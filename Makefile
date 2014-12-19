deploy-describe:
	gcloud preview container pods describe bitlab-voteview

deploy-delete:
	gcloud preview container pods delete bitlab-voteview

deploy-logs:
	gcloud compute ssh $(HOST) --command 'sudo docker logs --follow $(CONTAINER)'

# Note all the following tasks require ENVs:
# - BITLAB_VOTEVIEW_ACCESS_TOKEN

deploy-create:
	envsubst < deploy/pod.yaml | gcloud preview container pods create --config-file -

deploy-update:
	@make deploy-delete
	@make deploy-create

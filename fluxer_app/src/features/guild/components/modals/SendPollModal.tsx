import * as Modal from '@app/features/app/components/dialogs/Modal';
import * as ModalCommands from '@app/features/ui/commands/ModalCommands';
import {msg} from '@lingui/core/macro';
import {Trans, useLingui} from '@lingui/react/macro';
import {useReducedMotion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import {useCallback, useContext, useEffect, useId, useMemo} from 'react';
import {ModalFooterContext} from './add_guild_modal/shared';
import {Button} from '@app/features/ui/button/Button';
import {useFormSubmit} from '@app/features/app/hooks/useFormSubmit';
import {useForm} from 'react-hook-form';
import {Form} from '@app/features/ui/components/form/Form';
import {Input} from '@app/features/ui/components/form/FormInput';
import {PlusCircleIcon, PlusIcon} from '@phosphor-icons/react';
import {TextareaButton} from '@app/features/channel/components/textarea/TextareaButton';
import FocusRing from '@app/features/ui/focus_ring/FocusRing';
import styles from './SendPollModal.module.css';

const SEND_POLL_TITLE_DESCRIPTOR = msg({
	message: 'Send poll',
	comment: 'Title of the Send poll modal.',
});
const SEND_POLL_SEND_DESCRIPTOR = msg({
	message: 'Send',
	comment: 'Send button of the Send poll modal.',
});
const SEND_POLL_FORM_DESCRIPTOR = msg({
	message: 'Send poll form',
	comment: 'Accessible label for the send-poll form element. Used by assistive tech only.',
});
const POLL_TITLE_DESCRIPTOR = msg({
	message: 'Poll title',
	comment: 'Label of the poll title input in the send-poll form.',
});
const SEND_POLL_FORM_CHOICES_DESCRIPTOR = msg({
	message: 'Choices',
	comment: 'Label of the list of choices in the send-poll form.',
});

interface SendPollFormInputs {
	title: string;
	choices: Array<string>;
}

export const SendPollModal = observer(() => {
	const {i18n} = useLingui();
	const form = useForm<SendPollFormInputs>({defaultValues: {title: '', choices: []}});
	const formId = useId();
	const title = form.watch('title');
	const choices = form.watch('choices');
	const isTitleEmpty = useMemo(() => title.trim().length === 0, [title]);
	const onSubmit = useCallback(async (data: SendPollFormInputs) => {
		if (isTitleEmpty || choices.length < 1) {
			return;
		}
	}, []);
	const {handleSubmit, isSubmitting} = useFormSubmit({form, onSubmit, defaultErrorField: 'title'});

	const choicesList = choices.map((choice) => <li></li>);

	return (
		<Modal.Root size="medium" centered data-flx="channel.send-poll-modal.modal-root">
			<Modal.Header title={i18n._(SEND_POLL_TITLE_DESCRIPTOR)} data-flx="channel.send-poll-modal.modal-header" />
			<Modal.Content data-flx="channel.send-poll-modal.modal-content">
				<Modal.ContentLayout>
					<Form
						form={form}
						onSubmit={handleSubmit}
						id={formId}
						aria-label={i18n._(SEND_POLL_FORM_DESCRIPTOR)}
						data-flx="channel.send-poll-modal.form.submit"
					>
						<Input
							data-flx="channel.send-poll-modal.form.title"
							{...form.register('title')}
							autoFocus={true}
							error={form.formState.errors.title?.message}
							label={i18n._(POLL_TITLE_DESCRIPTOR)}
							minLength={1}
							maxLength={100}
							name="title"
							required={true}
							type="text"
						/>
						<h3>{i18n._(SEND_POLL_FORM_CHOICES_DESCRIPTOR)}</h3>
						<ul>
							{choicesList}
							<li>
								<div>
									{/*
                                    from ChannelHeader.tsx:
                                    <FocusRing offset={-2} data-flx="channel.channel-header.focus-ring--7">
                                        <button
                                            type="button"
                                            className={styles.iconButtonMobile}
                                            aria-label={
                                                isFavorited ? i18n._(REMOVE_FROM_FAVORITES_DESCRIPTOR) : i18n._(ADD_TO_FAVORITES_DESCRIPTOR)
                                            }
                                            aria-pressed={isFavorited}
                                            onClick={handleToggleFavorite}
                                            onContextMenu={handleFavoriteContextMenu}
                                            data-flx="channel.channel-header.icon-button-mobile.toggle-favorite"
                                        >
                                            <StarIcon
                                                className={styles.buttonIconMobile}
                                                weight={isFavorited ? 'fill' : 'bold'}
                                                data-flx="channel.channel-header.button-icon-mobile"
                                            />
                                        </button>
                                    </FocusRing>
                                    */}

									<Input
										data-flx="channel.send-poll-modal.form.choices-list.add-new"
										error={form.formState.errors.choices?.message}
										minLength={1}
										maxLength={50}
										type="text"
										name="add-new"
									/>
									<FocusRing offset={-2} data-flx="channel.send-poll-modal.form.add-new.focus-ring">
										<button type="button" onClick={() => {}} data-flx="channel.send-poll-modal.form.add-new.button">
											<PlusIcon
												className={styles.addNewButtonIcon}
												weight="fill"
												data-flx="channel.send-poll-modal.form.add-new.button-icon"
											/>
										</button>
									</FocusRing>
								</div>
							</li>
						</ul>
					</Form>
				</Modal.ContentLayout>
			</Modal.Content>
			<Modal.Footer data-flx="channel.send-poll-modal.modal-footer">
				<Button
					onClick={() => ModalCommands.pop()}
					variant="secondary"
					data-flx="channel.send-poll-modal.button.cancel"
				>
					<Trans>Cancel</Trans>
				</Button>
				<Button
					onClick={handleSubmit}
					submitting={isSubmitting}
					disabled={isTitleEmpty || choices.length < 1}
					data-flx="channel.send-poll-modal.button.send"
				>
					{i18n._(SEND_POLL_SEND_DESCRIPTOR)}
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
